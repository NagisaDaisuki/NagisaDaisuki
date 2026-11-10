---
title: H264编码算法原理分析
published: 2026-11-10
description: 从 FFmpeg/x264 编码流程到 Annex B 裸流解析，讲解宏块划分、帧内/帧间预测、变换量化、熵编码全链路，并分析有损环节、GOP/preset/码控与 SPS/PPS/IDR。
image: ./Cover.webp
tags: ["H.264", "视频编码", "FFmpeg", "x264"]
category: FFmpeg
draft: false
---

# H.264 编码全链路原理分析（FFmpeg/x264 视角）

"数据流向"：FFmpeg API → x264 编码器内部 → Annex B 裸流 → 宏块级压缩流水线 → 解码端如何"反向重建" → 有损发生在哪 → GOP/preset/码控 → NALU/SPS/PPS/IDR。

## 1. avcodec_send_frame() → avcodec_receive_packet() 发生了什么

FFmpeg 的编码 API 是"推帧/拉包"**异步模型**：

```c
AVCodecContext *enc = avcodec_alloc_context3(codec);
enc->width = 1920; enc->height = 1080;
enc->pix_fmt = AV_PIX_FMT_YUV420P;      // 注意：4:2:0，色度已经减半（第一处"有损"）
enc->time_base = (AVRational){1, 25};
enc->bit_rate = 2000000;                 // ABR 目标码率
av_opt_set(enc->priv_data, "preset", "medium", 0);
av_opt_set(enc->priv_data, "crf", "23", 0);
avcodec_open2(enc, codec, NULL);

// 编码循环
while (has_frame) {
    ret = avcodec_send_frame(enc, frame);          // ① 推入一帧 YUV
    while (ret >= 0) {
        ret = avcodec_receive_packet(enc, pkt);    // ② 取出一个编码后的 pkt
        if (ret == AVERROR(EAGAIN) || ret == AVERROR_EOF)
            break;
        fwrite(pkt->data, 1, pkt->size, fp);       // pkt->data 即 Annex B 裸流
        av_packet_unref(pkt);
    }
}
avcodec_send_frame(enc, NULL);   // flush：drain 内部缓冲的 B 帧
```

关键点：

- `EAGAIN` 是**正常现象**：x264 有 lookahead（预分析队列，默认约 40 帧的帧类型决策缓冲），B 帧重排序导致"送 1 帧未必立刻出 1 包"，必须双向驱动（送完再拉、拉到 EAGAIN 再送下一帧）。最后 `send_frame(NULL)` 触发 drain。
- `pkt->pts/dts` 由编码器回填：B 帧存在时 dts < pts（解码序 ≠ 显示序），间隔来自 SPS 里的 `log2_max_poc_lsb` / 时间基。
- `pkt->flags & AV_PKT_FLAG_KEY`：该包以 IDR NALU 开头。

### 1.1 内部调用链（libx264.c 包装层）

```
avcodec_send_frame()
  └─ ff_encode_send_frame()            // 帧进入 AVCodecInternal 缓冲
avcodec_receive_packet()
  └─ encode_receive_packet_internal()
      └─ ff_encode_encode_cb()
          └─ AVCodec.encode2() → libx264.c: X264_frame()
              ├─ AVFrame → x264_picture_t 转换（yuv plane 指针、pts 映射）
              ├─ x264_encoder_encode(h, &nal, &nnal, &pic_in, &pic_out)
              │     ↑ 这里才是真正的 H.264 编码，产出 NALU 数组
              └─ 遍历 nnal 个 NALU：
                    memcpy(pkt->data, nal[i].p_payload, nal[i].i_payload)
                    // x264 输出的 payload 已含起始码前缀 + EBSP（防竞争字节已插入）
                    // 首个 SPS/PPS 用 4 字节 start code，其余多数 3 字节
```

也就是说 **FFmpeg 本身不做 H.264 编码**，它只是帧格式/时间戳转换器；真正的压缩流水线在 x264 的 `x264_encoder_encode()` 里，内部流程为：

```
lookahead（帧类型/场景切换/码控预分析）
  → 每帧：slice 划分
      → 逐宏块：模式决策（帧内/帧间/跳过）
              → 预测 → 残差 → 4x4 整数变换 → 量化（有损！）
              → CAVLC/CABAC 熵编码写出语法元素
              → 重建（反量化→反变换→加预测→环路去块滤波）存入参考帧缓冲
  → 按 NALU 切分输出
```

## 2. Annex B 裸流的结构：NALU 逐字节解析

`pkt->data` 里是一串 NALU（Network Abstraction Layer Unit）：

```
[00 00 00 01][67 ..SPS..] [00 00 00 01][68 ..PPS..] [00 00 00 01][65 ..IDR slice..]
[00 00 01][41 ..P slice..] [00 00 01][01 ..B slice..] ...
```

### 2.1 起始码与防竞争字节

- **start code**：`00 00 01`（3B）或 `00 00 00 01`（4B，一般用于随机访问点前的 SPS/PPS/IDR）。解码器靠扫描这个前缀切分 NALU。
- 载荷里如果天然出现 `00 00 01` 会破坏切分，所以 EBSP（扩展字节序列）层在每两个连续 `00` 之后、下一个字节 ≤ 03 时，**插入 `03`**（emulation_prevention_three_byte）。解码端做反向剥离得到 RBSP：

```c
// EBSP → RBSP（剥 0x03）
size_t ebsp_to_rbsp(uint8_t *dst, const uint8_t *src, size_t n) {
    size_t z = 0, j = 0;
    for (size_t i = 0; i < n; i++) {
        if (z >= 2 && src[i] == 0x03 && i + 1 < n && src[i+1] <= 3) {
            z = 0; continue;          // 丢弃伪起始字节
        }
        z = src[i] ? 0 : z + 1;
        dst[j++] = src[i];
    }
    return j;   // RBSP 末尾还有 rbsp_trailing_bits：一个 '1' + 补零对齐
}
```

之后 RBSP 再剥掉 trailing bits 得到 SODB（实际语法比特流），用**无符号指数哥伦布 ue(v)** 解析：

```
ue(v): 0→1, 1→010, 2→011, 3→00100 ...（数前导零 k，读 k 位后缀，值 = 2^k - 1 + 后缀）
se(v): 映射 ue(v)：0→0, 1→1, 2→-1, 3→2, 4→-2 ...
```

### 2.2 NALU 头（1 字节）

```
+---------------+---------------+---------------+---------------+
| forbidden(1b) | nal_ref_idc(2b) | nal_unit_type(5b)             |
+---------------+---------------+---------------+---------------+

0x67 = 0110_0111 → ref_idc=3（重要，做参考），type=7  SPS
0x68 = 0110_1000 → ref_idc=3,       type=8  PPS
0x65 = 0110_0101 → ref_idc=3,       type=5  IDR 帧的 slice
0x41 = 0100_0001 → ref_idc=2,       type=1  非IDR slice（P帧/做参考的B帧）
0x01 = 0000_0001 → ref_idc=0,       type=1  不做参考的 B 帧（可丢弃）
0x06 = 0000_0110 → type=6  SEI 补充信息
0x09 = 0000_1001 → type=9  Access Unit Delimiter
```

`nal_ref_idc` > 0 表示该 NALU 的内容参与参考帧构建，丢不得；=0 的包（非参考 B 帧、SEI）在丢包/丢帧时可牺牲。

## 3. 宏块级压缩流水线（残差 + 模式的核心思想）

H.264 的根本思路一句话：**不传像素，传"预测值是怎么来的（模式）+ 预测差了多少（残差）"**。残差经过"变换→量化"后大部分系数为 0，熵编码只需高效表达"零的位置 + 少数非零值"。

### 3.1 宏块划分

一帧按 16×16 划分成宏块（MB）。每个 MB 先选粗块型，再细分：

```
帧间（P/B）：16x16 → 16x8 / 8x16 → 8x8 → 8x4 / 4x8 → 4x4
             每个 8x8 子块可以独立选运动矢量（MVP 细分）
帧内（I4x4）：16 个 4x4 块，各自选预测模式
帧内（I16x16）：整个 16x16 一个模式（平坦区用）
8x8 变换（--8x8dct，High Profile）：帧内 8x8 预测块
P_Skip：无残差、无 MV 增量，运动矢量 = 相邻块预测值，直接拷贝参考块
        （静止画面/背景 = 每宏块几乎 0 比特，这是 H.264 压缩率的最大来源之一）
```

x264 的决策代码骨架（`analyse.c`）：

```c
// 伪代码，对应 x264_macroblock_analyse()
int intra_cost = x264_mb_analyse_intra(h, &analysis, lambda);   // 遍历 9 种 4x4 / 4 种 16x16 模式，算 SATD/SAD
int inter_cost = x264_mb_analyse_inter(h, &analysis, lambda);   // 运动估计 + 补偿，算 SAD/SATD + λ*码率代价
if (inter_cost < intra_cost)
    try_pskip / B-direct;       // 再试 Skip/直接模式
else
    选最优 intra 模式（可能再做 RDO：对每个候选真的做完变换量化熵编码，取真实 RD 代价）
```

代价函数统一为 RD 意义：`J = D + λ·R`（失真 + λ×码率）。**模式选择本身就在做率失真优化**。

### 3.2 帧内预测（I 帧：空间域）

用**当前帧已重建的相邻像素**预测当前块（注意：用重建值而非原始值，保证编解码一致）：

- 4x4 亮度块 9 种模式：Vertical / Horizontal / DC / 6 个对角方向（DDL、DDR、VR、HD、VL、HU），预测像素按方向从左列/上行外推加权平均。
- 16x16 亮度块 4 种模式：V / H / DC / Plane（平面对象，适合渐变光照）。
- 色度块 4 种模式：DC / V / H / Plane。

只传**模式号 + 残差**。平坦区域残差极小甚至为 0。

### 3.3 帧间预测（P/B 帧：时间域）

- **运动估计（ME）**：在参考帧里为每个块找最相似的位置，得到运动矢量 MV。x264 用多级搜索：`dia`（小菱形）→ `hex`（六边形，默认）→ `umh/esa`（大范围，preset 高档）。
- **亚像素精度**：整像素找到后继续细化到 1/2、1/4 像素。半像素位置用 6 抽头维纳滤波插值生成（`subme` 控制细化深度）。
- **运动补偿（MC）**：从参考帧按 MV 取块作为预测值。
- 传输的是 **MV 增量（mvd）+ 参考帧号（ref_idx）**，MV 本身由中值预测器从左/上/右上邻块推出（again：只传差值）。
- B 帧额外有双向预测（前后参考加权）、直接模式（空域/时域推导 MV，几乎不传运动信息）。

### 3.4 残差 → 变换 → 量化 → 熵编码（每块）

```c
// 对应 x264_mb_encode_i4x4() 的核心
for each 4x4 block:
    residual[i] = current[i] - prediction[i];          // 预测残差
    dct4x4(residual, block);                           // 4x4 整数变换（DCT 的整数近似）
    quant(block, qpuv, qp, qpdc);                      // ★ 唯一的"故意不可逆"环节
    if (全零)  cbp 对应位置清零，一个系数都不写          // 大量块在此被"清空"
    else       zigzag 扫描 → CAVLC 或 CABAC 写出
// 16x16 帧内模式额外对 16 个 DC 系数做 Hadamard 变换再量化
```

**整数变换**：H.264 不用真 DCT（浮点会造成编解码端结果不一致，违反"重建必须一致"原则），用的是 DCT 的整数近似核：

```
     | 1  1  1  1 |
H =  | 2  1 -1 -2 |        Y = (H · X · Hᵀ) ⊗ E    （E 为能量归一化缩放，并进量化表）
     | 1 -1 -1  1 |
     | 1 -2  2 -1 |
```

全部整数移位/乘法，编解码两端可比特级一致。16x16 帧内块在 4x4 变换后还有一次 4x4 Hadamard 处理 DC 系数，进一步压缩低频能量。

### 3.5 量化 ★ 有损的核心

量化把连续分布的变换系数映射到有限档位，公式（规范定义，x264 实现对应版本）：

```
qbits = 15 + floor(QP / 6)
MF    = 量化表[QP % 6][位置]          // 6 张 4x4 表循环，QP+6 时步长精确 ×2
intra:  level = (|coef| · MF + (1 << (qbits/3))) >> qbits   // f = 128（qbits=15）
inter:  level = (|coef| · MF + (1 << (qbits/6))) >> qbits   // f = 2（qbits=15）
```

关键在偏移量 f 的差异：inter 的 f 小得多 → 更容易舍到 0 → **死区（dead zone）**。死区让小系数（多为噪声）直接归零，对主观质量几乎无害，却大幅省码率——这是 H.264 率失真设计的精髓之一。

- QP 范围 0–51（8bit），每 +6 QP 量化步长翻倍，码率约减半、PSNR 约 -1~~2 dB；QP 每 +1 ≈ 码率 -5~~8%。
- 反量化（重建用）：`coef' = level × MF⁻¹ << (QP/6 调整)`，Qstep 随 QP 指数增长，**放大回来的值 ≠ 原值**，误差就固定在这里了。

### 3.6 熵编码：CAVLC vs CABAC

PPS 里 `entropy_coding_mode_flag` 二选一：

**CAVLC（Baseline/Main，较简单）**——针对"残差系数分布"定制：块内非零系数集中在低频、高频多为 0。按 zigzag 顺序编码：

1. `coeff_token`：TotalCoeff + TrailingOnes 个数，VLC 表按上下文 **nC**（左右邻块非零系数个数的均值）选择——邻块系数多，本块大概也多，用不同概率表；
2. TrailingOnes（末尾 ±1）的符号各 1 bit；
3. 非尾随 level：`level_prefix + level_suffix`（近指数哥伦布，自适应幅度）；
4. `total_zeros`（最后一个非零系数前总零数）+ `run_before`（每个非零系数前的零游程）。

**CABAC（Main/High，省码率 10~15%）**——四步流水线：

```
① 上下文建模：399 个上下文（σ 状态 + MPS 概念），如 "significant_flag[16] 上下文"
   按块内位置 i<3 / 3~8 / >8 分三组，并随编码自适应更新概率
② 二进制化：语法元素 → bin 串（Unary / 截断一元 / EGk / FL 混合）
③ 算术编码引擎：维护 [low, range)，按 bin 概率区间细分
   range ≈ 2^9，MPS 分支 range -= (range>>6)&-4 之类近似，保证整数实现
④ 归一化：range < 2^8 时移位并输出比特
大概率 bin 走 bypass（等概率旁路模式，免查表）
```

CABAC 用自适应概率逼近真实信源，且算术编码可表达任意分数概率——这就是它比静态 VLC 省码率的原因。

### 3.7 重建环路（为什么编码器内部还有个"解码器"）

量化后 x264 立刻做反量化→反变换→加回预测→环路去块滤波（deblocking），得到**重建宏块**放回重建帧并作为后续帧的参考。原因：

> 解码器只有量化后的残差和模式信息。如果编码端预测时用**原始帧**、解码端却只能用**重建帧**，两边预测值不同，残差对不上，误差会指数级累积（漂移）。所以编码器必须内置一个与解码器比特级一致的解码器。

去块滤波（`deblocking_filter_control_present_flag`，强度 0–4 由块边界两侧的 MB 类型/MV 差决定，α/β 阈值由 QP 查表）平滑 4x4/8x8 变换块边界，属于**环路内**操作——它改的是"以后所有帧都要参考的重建帧"，解码端执行完全相同的滤波，因此不算额外的编解码失配，但确实让重建帧进一步偏离原始帧（换取更少的块效应和更小的后续残差）。

## 4. 解码端如何"反向推导"出图像

现在站在解码器角度回答——**裸流里只有"模式 + 残差系数"，原始帧是怎么出来的**：

```
对每个 NALU:  剥 start code → EBSP→RBSP → 解析 NAL 头
SPS/PPS:     记录图像尺寸、宏块数、参考帧数、熵编码模式、初始 QP 等"全局参数"
IDR/P/B slice:
    解析 slice 头（slice_type、frame_num、POC、QP 增量、deblock 参数）
    逐宏块：
      ① 解码 mb_type / intra 模式号 / (ref_idx + mvd) → 得到"预测是怎么做的"
      ② 用已解码并重建好的参考帧（或本帧已重建邻块）执行完全相同的预测运算
         → 得到 prediction[]（编码端做的是同一件事，所以两边结果比特级一致）
      ③ 解码 CBP + 残差系数（CAVLC/CABAC）→ level[]（量化后的域）
      ④ 反量化：coef = level × Qstep(QP)            ← 这里把"丢掉的小数"永久丢失
      ⑤ 反变换：X = Hᵀ · Y · H（整数逆核）
      ⑥ 像素 = prediction + residual                ← 重建宏块
      ⑦ 环路去块滤波（与编码端相同的强度/阈值）
    全帧完成 → 放入 DPB，按 POC 重排输出
```

所以准确地说：解码器**不是恢复原始帧，而是构造"编码器端重建帧的副本"**。

```
重建帧 = Σ( 预测(由模式从重建参考推出) + 反量化反变换(量化残差) ) → deblocking
```

### 4.1 有损到底发生在哪一步

| 环节                    | 是否有损                             | 说明                                                                          |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| 输入 4:2:0 色度下采样   | ✅                                   | 在进编码器之前，色度分辨率减半                                                |
| 帧内/帧间预测、模式决策 | ❌                                   | 只是选择，无损                                                                |
| 运动估计/亚像素 MC 插值 | ⚠️                                   | 插值有微小舍入误差，但被并入残差；真正的损失是"预测不准→残差经量化后误差放大" |
| 4x4 整数变换            | ❌（近似无损）                       | QP=0 且加正确舍入偏移时基本可逆                                               |
| **量化**                | ✅ **✅✅ 主要且唯一刻意的有损环节** | 高频小系数被死区抹为 0；level 无法还原精确 coef                               |
| 熵编码                  | ❌                                   | 完全可逆                                                                      |
| 反量化/反变换舍入       | ⚠️                                   | 固定舍入方向的小偏差                                                          |
| 环路去块滤波            | ⚠️                                   | 修改重建像素，让参考帧偏离原始（但编解码一致，不是失配）                      |
| 码控丢帧/强制 IDR       | ✅                                   | 整帧信息丢弃                                                                  |

一句话：**DCT 本身无损，量化是有损的闸门；量化残差 + 参考帧漂移共同构成累积误差。**

## 5. GOP、preset、码率控制

### 5.1 GOP（Group of Pictures）

```
IDR        P       B  B  P       B  P    ...        IDR
|--帧内刷新--|----- 帧间预测链（参考 IDR 及重建帧）-----|   新GOP
```

- **GOP** = 一个 IDR/I 帧到下一个 IDR/I 帧之间的帧序列。I 帧只能自己编码（无参考），码率最大；P/B 帧靠参考，码率低。
- **IDR vs 普通 I 帧**：IDR 是"立即刷新"——**IDR 之后任何帧都禁止参考 IDR 之前的帧**，POC 重置、DPB 清空、所有时序预测链断裂。普通 I 帧自身是帧内编码，但**后续 B 帧仍可以越过它参考更早的帧**（开 GOP）。x264 默认 closed GOP（`open_gop=0`）。
- 关键参数：`keyint`（最大 GOP，x264 默认 250 ≈ 10s@25fps）、`min-keyint`、`scenecut`（镜头切换检测，提前插 I 帧）。直播/点播场景 GOP 短 → 起播快、seek 快、抗丢包好，但码率上升（I 帧贵）。FFmpeg：`-g 250 -keyint_min 25 -scenecut 40`。
- x264 默认在 IDR 前输出 SPS+PPS（`repeat_headers`），这也是为什么裸流开头总是 `67 68 65` 三连。

### 5.2 preset：用"搜索努力程度"换压缩率

preset（ultrafast → placebo）不改变语法兼容性，只改**编码器内部的搜索深度**——所有档位产出的都是合法 H.264，只是压缩效率和编码耗时代价不同。大致趋势：

| 档位               | 典型调整                                                                                       | 相对效果                           |
| ------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------- |
| ultrafast          | CABAC 关、ref=1、me=dia、subme=0、trellis=0、无 lookahead 优化                                 | 速度最快，码率比 medium 高 25~50%  |
| superfast/veryfast | ref=1、me=dia、subme↓、部分 8x8dct 关                                                          | 快，略费码率                       |
| **medium（默认）** | ref=3、bframes=3、me=hex、subme=7、trellis=1、CABAC                                            | 基准                               |
| slow/slower        | ref=5~~8、me=umh、subme 8~~10、mixed-ref、RDO（把模式决策换成"真的编码一遍看代价"）、trellis=2 | 码率 -5~10%，慢数倍                |
| placebo            | 一切极限搜索                                                                                   | 只比 slower 好 1% 左右，无实用价值 |

（各档确切参数在 x264 源码 `common/base.c` 的 `x264_param_apply_preset()` 中。）典型场景：直播转码用 veryfast/faster，离线点播用 slow。

### 5.3 码率控制（RC）

核心都是围绕 QP 做文章，四种主流模式：

```c
// FFmpeg 映射
"-crf 23"                                // 恒定质量
"-b:v 2M"                                // 平均码率 ABR
"-b:v 2M -maxrate 2.5M -bufsize 5M"      // ABR + VBV（≈CBR 约束）
"-qp 18"                                 // 固定 QP（无码控）
```

- **CRF（Constant Rate Factor，0–51，默认 23）**：目标"恒定主观质量"。内部按每帧复杂度（lookahead 算的 SATD）自适应调 QP：简单场景压低 QP 保质量、复杂场景抬 QP 控码率。码率不可预期，但每个 crf 值对应恒定的相对质量（+6 crf ≈ 码率减半）。**压片首选。**
- **ABR**：指定平均码率，RC 按复杂度分摊比特（I 帧 ≈ 若干倍 P 帧预算），1-pass 时估计偏差较大，配合 2-pass（`--pass 1/2`，第一遍统计全片复杂度写 stats 文件）精度大增。
- **VBV（Video Buffering Verifier）**：`maxrate + bufsize` 定义一个虚拟缓冲区（bufsize ≈ 窗口秒数 × maxrate），RC 在窗口内强制包络约束——流媒体/硬件解码器/低延迟直播必开，否则瞬间高复杂度场景会顶爆解码缓冲。
- **AQ（Adaptive Quantization）**：在 VBV/CRF 之上按宏块级方差微调 QP，把比特从"看不出细节的平坦区"挪给"人眼敏感区"（配合 psy-rdo/psy-trellis 做心理视觉优化）。
- 优先级提示：`-qp` 与 `-crf`/`-b:v` 互斥；`-crf` + `-maxrate/-bufsize` 可以组合成"质量上限 + 码率封顶"。

## 6. SPS / PPS / IDR 关键字段速查

**SPS（seq_parameter_set，NAL type 7）**——图像级"宪法"，解码前必须先有它：

```
profile_idc            66=Baseline(无CABAC/B帧) 77=Main 100=High(8x8dct)
level_idc              最大分辨率/帧率/码率等级
log2_max_frame_num     frame_num 位宽（解码序号）
pic_order_cnt_type     POC 计算方式（显示序，B 帧重排依据）
num_ref_frames         参考帧缓冲大小（DPB 深度，preset 的 ref 参数写到这里）
pic_width_in_mbs_minus1 / pic_height_in_map_units_minus1   尺寸（宏块单位）
frame_mbs_only_flag    是否逐行
frame_cropping_flag    宏块 16 对齐后的裁剪量
vui_parameters         时基、aspect ratio、码率上限等
```

**PPS（pic_parameter_set，NAL type 8）**——图像级参数集，可有多套、slice 头里用 `pps_id` 引用：

```
entropy_coding_mode_flag    0=CAVLC  1=CABAC
num_ref_idx_l0/l1_active    P/B 帧默认参考帧数
pic_init_qp_minus26         初始亮度 QP（26 基准）
deblocking_filter_control_present_flag
weighted_pred / weighted_bipred    B 帧加权预测
```

**IDR slice（NAL type 5）** 的 slice 头里多一个 `idr_pic_id`；`frame_num` 从 0 重新计数。见到 `00 00 00 01 65` 就是随机访问点——播放器 seek、直播观众进房都从这里开始解码。

一个真实裸流开头通常长这样：

```
00 00 00 01 67 42 C0 1E ...   SPS  (Baseline/High, 尺寸、ref 数……)
00 00 00 01 68 CE 3C 80 ...   PPS  (CABAC=1, init_qp……)
00 00 00 01 65 88 84 ...      IDR slice（第一个 I 帧）
00 00 01 41 9A ...            P slice（ref_idc=2）
00 00 01 01 9E ...            非 ref B slice（ref_idc=0）
```

## 7. 全图总结

```
YUV 帧 ──► lookahead(帧类型/GOP决策) ──► 逐宏块：
   划分模式决策(RDO) ─► 帧内9/4种 或 帧间ME+MC ─► 残差
   ─► 4x4整数变换 ─► ★量化(有损闸门, QP/死区) ─► CAVLC/CABAC
                                        │
   └─ 反量化 ◄──────────────────────────┘
      ─► 反变换 ─► +预测 ─► 去块滤波 ─► 重建帧(参考缓冲)
                                     │
量化系数+模式+MV增量 ─► NALU打包(EBSP防竞争+start code) ─► Annex B 裸流
                                     │
解码端：剥包 → 模式重建预测 + 反量化反变换残差 → deblocking → 重建帧副本
```

- 压缩率三大来源：**残差量化后大量归零（Skip/平坦块零比特）**、**只传模式与增量而非绝对值**、**熵编码按上下文自适应压缩**。
- 有损只在**量化**（以及前置的色度下采样与参考帧漂移），其余环节全部可逆。
- 码控（CRF/ABR/VBV）与 preset 决定"量化闸门开多大、模式搜索多认真"，GOP 结构决定随机访问能力与 I 帧开销。
