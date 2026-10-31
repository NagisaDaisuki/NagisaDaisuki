---
title: FFmpeg 常用命令速查手册
published: 2025-09-02
description: "以实际音视频工作流为中心的 FFmpeg 手册：媒体信息查看、转码与编码参数、视频滤镜、音频处理、字幕封面、GIF 与批处理速查。"
category: FFmpeg 
image: "./cover.jpg"
tags: ["FFmpeg", "ffmpeg", "video", "audio", "tools"]
author: Akeboshi Himari
draft: false
---

# FFmpeg 常用命令速查手册

> 一份以**实际音视频处理工作流**为中心的 FFmpeg 手册。
> 覆盖：媒体信息查看、视频转码与编码参数、常用滤镜、视频剪辑与拼接、音频处理、字幕与封面、GIF、图片处理、录屏采集、批处理，以及常用参数速查表。

## 📚 快速索引

| 需求 | 章节 |
| --- | --- |
| 查看文件信息 / 流信息 / 时长码率 | [二、查看媒体信息](#二查看媒体信息) |
| 视频 / 音频格式转换，编码与质量参数 | [三、四、五](#三编码与质量参数速查) |
| 裁剪 / 拼接 / 变速 / 倒放 | [六、视频剪辑与拼接](#六视频剪辑与拼接) |
| 提取音频 / 响度标准化 / 混音 / 静音 | [七、音频处理](#七音频处理) |
| 硬字幕 / 软字幕 / 封面 | [八、字幕与封面](#八字幕与封面) |
| GIF 制作 | [九、GIF 制作](#九gif-制作) |
| 截图 / 水印 / 缩放 / 旋转 / 去噪 | [五、十](#五常用视频滤镜) |
| 录屏 / 摄像头 | [十一、录屏与采集](#十一录屏与采集) |
| 元数据 / 帮助 / 批处理 | [十二、十三、十四](#十二元数据与杂项) |

---

# 一、基础概念

FFmpeg 是一个强大的开源音视频处理工具。相比桌面软件，很多重复性的音视频任务用命令行更简洁高效，也适合批处理。

- **封装格式（Container）**：把视频、音频、字幕、封面等数据组织到同一个文件的"容器"，如 `MP4`、`MKV`、`MOV`、`WebM`。封装格式 ≠ 编码格式。
- **流（Stream）**：一个文件可包含多条独立的视频 / 音频 / 字幕流。FFmpeg 的很多操作本质是：选择流（`-map`）、提取、复制（`-c copy`）、转码、合并。
- **编码器（Codec）**：视频常见 H.264、H.265、AV1、VP9；音频常见 AAC、Opus、MP3、FLAC、PCM。

---

# 二、查看媒体信息

## 1. 快速查看基本信息

```shell
ffmpeg -i input.mp4
```

输出包括：

```text
Duration: 00:02:30.04, start: 0.000000, bitrate: 6205 kb/s
Stream #0:0: Video: h264, yuv420p, 3840x2160, 25 fps
Stream #0:1: Audio: aac, 48000 Hz, stereo
```

> 不指定输出文件会报 "At least one output file must be specified"，属正常现象，信息已经打印。加 `-hide_banner` 可屏蔽版本信息。

## 2. ffprobe：更精确的信息查询

ffprobe 是 FFmpeg 自带的探测工具，适合脚本化提取信息。

查看封装与流概览：

```shell
ffprobe -hide_banner input.mp4
```

输出 JSON 格式的完整信息：

```shell
ffprobe -v error -show_format -show_streams -of json input.mp4
```

只提取某几项信息（便于脚本使用）：

```shell
# 视频流：编码、分辨率、帧率、码率
ffprobe -v error -select_streams v:0 \
-show_entries stream=codec_name,width,height,r_frame_rate,bit_rate \
-of default=noprint_wrappers=1 input.mp4

# 只看总时长（秒）
ffprobe -v error -show_entries format=duration -of csv=p=0 input.mp4

# 音频流：编码、采样率、声道数
ffprobe -v error -select_streams a:0 \
-show_entries stream=codec_name,sample_rate,channels \
-of json input.mkv
```

列出文件中的所有流及其类型：

```shell
ffprobe -v error -show_entries stream=index,codec_type,codec_name -of csv input.mkv
```

## 3. 检查文件能否完整解码

```shell
ffmpeg -v error -i input.mp4 -f null -
```

> 无输出即解码无误；有输出则打印出错位置，适合验证下载 / 转码结果的完整性。

---

# 三、编码与质量参数速查

## 1. 视频编码器质量参数对照

| 编码器 | 质量参数 | 常用范围 | 说明 |
| --- | --- | --- | --- |
| `libx264` | `-crf` | 18～28（默认 23） | 18 左右接近视觉无损，值越低质量越高 |
| `libx265` | `-crf` | 24～30（默认 28） | 同码率下比 x264 体积小约一半 |
| `libsvtav1` | `-crf` | 20～45 | AV1，压缩率最高，编码较慢 |
| `h264_nvenc` | `-cq` | 19～28 | NVIDIA 硬编，不要照搬 x264 的 CRF 概念 |
| `hevc_nvenc` | `-cq` | 24～32 | NVIDIA HEVC 硬编 |
| `h264_qsv` | `-global_quality` | 20～28 | Intel QSV 硬编 |

`-preset`（主要针对 x264 / x265，控制速度与压缩效率的平衡）：

```text
ultrafast → superfast → veryfast → faster → fast
→ medium（默认）→ slow → slower → veryslow → placebo
```

> 越靠右：编码越慢、同画质体积越小。日常推荐 `slow`；追求体积用 `veryslow`。

## 2. 音频编码器参数对照

| 目标格式 | 编码器 | 常用参数 |
| --- | --- | --- |
| AAC | `aac` | `-b:a 192k`（立体声常用 128k～256k） |
| MP3 | `libmp3lame` | `-q:a 2`（VBR 高质量）或 `-b:a 320k` |
| Opus | `libopus` | `-b:a 128k` |
| FLAC | `flac` | `-compression_level 8`（无损，等级只影响体积与速度） |
| Vorbis | `libvorbis` | `-q:a 5` |

## 3. 通用参数

| 参数 | 作用 |
| --- | --- |
| `-c:v` / `-c:a` | 指定视频 / 音频编码器 |
| `-c copy` | 所有流直接复制，不重新编码（速度快、无损，但受滤镜和容器兼容性限制） |
| `-b:v 5000k` | 指定视频平均码率（CBR/VBR 场景） |
| `-maxrate` / `-bufsize` | 码率上限与 VBV 缓冲，如 `-maxrate 7000k -bufsize 12400k` |
| `-pix_fmt yuv420p` | 强制 8-bit 4:2:0，最大化播放器兼容性 |
| `-r 30` | 输出帧率 |
| `-s 1280x720` | 输出分辨率（通常用 `scale` 滤镜代替） |
| `-ss` / `-to` / `-t` | 起始时间 / 结束时间 / 持续时长 |
| `-y` / `-n` | 覆盖 / 跳过已存在的输出文件 |
| `-threads 0` | 线程数，0 = 自动（默认即自动，一般无需手动设置） |
| `-map` | 明确选择输入中的哪些流进入输出 |

## 4. 两遍编码（目标体积场景）

当需要精确控制输出体积时使用（如目标 5000 kb/s）：

```shell
ffmpeg -y -i input.mp4 -c:v libx264 -b:v 5000k -pass 1 -an -f null /dev/null
ffmpeg -i input.mp4 -c:v libx264 -b:v 5000k -pass 2 -c:a aac -b:a 192k output.mp4
```

> 第一遍分析画面复杂度，第二遍按分析结果精确分配码率。Windows 下将 `/dev/null` 换成 `NUL`。

---

# 四、视频转码

## 1. 转码为 MP4（H.264 + AAC）

```shell
ffmpeg -i input.mov \
-c:v libx264 -preset slow -crf 20 \
-pix_fmt yuv420p \
-c:a aac -b:a 192k \
output.mp4
```

## 2. 转码为 H.265

```shell
ffmpeg -i input.mp4 \
-c:v libx265 -preset slow -crf 26 \
-tag:v hvc1 \
-c:a copy \
output.mp4
```

> `-tag:v hvc1` 让 HEVC 在苹果设备 / QuickTime 上正常播放。

## 3. GPU 硬件转码（NVIDIA）

```shell
ffmpeg -hwaccel cuda -i input.mp4 \
-c:v h264_nvenc -preset p5 -cq 23 \
-c:a copy \
output.mp4
```

> 硬编速度快但同体积画质略低于软编；`-preset p1`（最快）～`-p7`（最慢质量最好）。Intel 核显用 `-c:v h264_qsv`。

## 4. 转码为 WebM（VP9）

```shell
ffmpeg -i input.mp4 \
-c:v libvpx-vp9 -crf 34 -b:v 0 \
-row-mt 1 \
-c:a libopus -b:a 128k \
output.webm
```

> `-crf 34 -b:v 0` 是 VP9 的恒定质量模式；`-row-mt 1` 开启多线程编码。

## 5. 仅改封装，不重编码（Remux）

```shell
# MKV → MP4（前提：流编码与容器兼容，如 H.264 + AAC）
ffmpeg -i input.mkv -c copy output.mp4

# 修正时间戳
ffmpeg -i input.mkv -c copy -fflags +genpts output.mp4
```

---

# 五、常用视频滤镜

以下滤镜通过 `-vf`（视频滤镜）使用；使用任何视频滤镜后视频必须重新编码，音频可继续 `-c:a copy`。

## 1. 缩放 scale

```shell
# 指定分辨率
ffmpeg -i input.mp4 -vf "scale=1280:720" output.mp4

# 保持比例，高度 720（-2 保证宽度为偶数，避免编码报错）
ffmpeg -i input.mp4 -vf "scale=-2:720" output.mp4
```

## 2. 裁剪 crop

```shell
# crop=宽:高:x:y（x:y 为左上角坐标）
ffmpeg -i input.mp4 -vf "crop=ih*9/16:ih" output_916.mp4   # 裁成 9:16 竖屏
```

自动检测并裁掉黑边：

```shell
# 第一步：检测，观察日志中的 crop=宽:高:x:y
ffmpeg -i input.mkv -vf cropdetect -f null -

# 第二步：填入检测结果
ffmpeg -i input.mkv -vf "crop=608:1080:656:0" -c:a copy output.mkv
```

## 3. 旋转与翻转

```shell
# 顺时针旋转 90 度（transpose=0 逆时针90，=2 顺时针180，=3 逆时针90）
ffmpeg -i input.mp4 -vf "transpose=1" output.mp4

# 水平 / 垂直镜像
ffmpeg -i input.mp4 -vf "hflip" output.mp4
ffmpeg -i input.mp4 -vf "vflip" output.mp4
```

## 4. 添加边框 pad

```shell
# pad=总宽:总高:x偏移:y偏移:颜色
ffmpeg -i input.mp4 -vf "pad=1920:1080:0:210:black" output.mp4
```

## 5. 添加文字 drawtext

```shell
ffmpeg -i input.mp4 \
-vf "drawtext=text='Hello FFmpeg':fontsize=48:fontcolor=white:x=20:y=20" \
-c:a copy output.mp4
```

> 中文字体在 Windows 下可加 `fontfile='C\:/Windows/Fonts/msyh.ttc'`；注意转义。

## 6. 叠加水印 overlay

```shell
ffmpeg -i input.mp4 -i logo.png \
-filter_complex "overlay=W-w-20:H-h-20" \
-c:a copy output.mp4
```

> `W-w-20:H-h-20` 表示右下角留 20px 边距；左上角用 `20:20`。

## 7. 调整亮度 / 对比度 / 饱和度 eq

```shell
ffmpeg -i input.mp4 -vf "eq=brightness=0.05:contrast=1.2:saturation=1.3" -c:a copy output.mp4
```

## 8. 淡入淡出 fade

```shell
# 开头 1s 淡入 + 第 9s 起 1s 淡出
ffmpeg -i input.mp4 \
-vf "fade=t=in:st=0:d=1,fade=t=out:st=9:d=1" \
-c:a copy output.mp4
```

## 9. 去隔行 yadif / 降噪 hqdn3d / 锐化 unsharp

```shell
ffmpeg -i input.avi -vf "yadif" -c:a copy output.mp4        # 去隔行
ffmpeg -i input.mp4 -vf "hqdn3d=4:3:6:4.5" -c:a copy out.mp4 # 降噪
ffmpeg -i input.mp4 -vf "unsharp=5:5:1.0" -c:a copy out.mp4  # 锐化
```

## 10. 烧录字幕 subtitles / ass

```shell
ffmpeg -i input.mp4 -vf "ass=subtitle.ass" -c:a copy output.mp4
```

## 11. 调整帧率 fps

```shell
ffmpeg -i input.mp4 -vf "fps=30" -c:a copy output.mp4
```

## 12. 像素格式转换

```shell
ffmpeg -i input.mp4 -vf "format=yuv420p" -c:a copy output.mp4
```

---

# 六、视频剪辑与拼接

## 1. 无损裁剪（不重编码）

```shell
ffmpeg -ss 00:00:10 -i input.mp4 -t 00:00:20 -c copy output.mp4
```

- `-ss`：起始时间；`-t`：持续时间（也可用 `-to 00:00:30` 指定结束点）
- `-c copy`：直接复制流，速度极快

> ⚠️ 无损裁剪的切点受**关键帧**影响，不一定逐帧精确。需要精确切点时重编码：
>
> ```shell
> ffmpeg -ss 00:01:00 -to 00:02:00 -i input.mp4 \
> -c:v libx264 -crf 20 -c:a aac output.mp4
> ```
>
> `-ss` 放在 `-i` **前**速度快（按关键帧定位），放在 `-i` **后**更精确（逐帧解码定位）。放在前面时 FFmpeg 会自动向前对齐再精确解码，日常使用放在前面即可。

## 2. 调整播放速度

```shell
# 视频快 2 倍（音频不变）
ffmpeg -i input.mp4 -vf "setpts=0.5*PTS" -an output_fast.mp4

# 视频音频同时变速（atempo 支持范围 0.5～100，超范围需级联）
ffmpeg -i input.mp4 \
-filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" \
-map "[v]" -map "[a]" output_fast.mp4
```

## 3. 视频倒放

```shell
ffmpeg -i input.mp4 -vf "reverse" -af "areverse" output.mp4
```

> 倒放需要把整段视频读入内存，长视频慎用。

## 4. 无损拼接多段视频（编码参数相同时）

先准备 `list.txt`：

```text
file 'part1.mp4'
file 'part2.mp4'
file 'part3.mp4'
```

```shell
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4
```

> `-safe 0` 允许绝对路径 / 特殊字符文件名。拼接要求各片段编码参数一致，否则需重编码拼接：

```shell
ffmpeg -i part1.mp4 -i part2.mp4 \
-filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" \
-map "[v]" -map "[a]" output.mp4
```

## 5. 抽帧与序列帧合成视频

```shell
# 每秒提取 1 帧为图片
ffmpeg -i input.mp4 -vf "fps=1" image_%03d.jpg

# GPU 加速抽帧
ffmpeg -hwaccel cuda -ss 00:00:30 -to 00:00:40 -i input.mp4 \
-vf fps=1 output/frame_%04d.jpg

# 提取某一帧作为封面
ffmpeg -ss 00:00:05 -i input.mp4 -frames:v 1 cover.jpg

# 序列帧合成视频
ffmpeg -framerate 24 -i image_%03d.jpg -c:v libx264 -crf 18 -pix_fmt yuv420p output.mp4
```

## 6. 纯音频生成黑场视频

```shell
ffmpeg -i your_audio.mp3 \
-f lavfi -i "color=c=black:s=1920x1080:r=30" \
-c:v libx264 -pix_fmt yuv420p -c:a copy \
-shortest output_black_video.mp4
```

> `-shortest` 让输出在最短的流结束时结束；配合 `-loop 1` 的图片输入时同样关键。

---

# 七、音频处理

## 1. 提取音频

```shell
# 直接复制原始音频流（格式需与扩展名兼容）
ffmpeg -i input.mp4 -vn -c:a copy output.aac

# 转码为 AAC
ffmpeg -i input.mp4 -vn -c:a aac -b:a 192k output.m4a

# 转码为 MP3
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3

# 转码为无损 FLAC
ffmpeg -i input.mp4 -vn -c:a flac output.flac
```

## 2. 提取为 PCM WAV

```shell
# PCM 24-bit / 48 kHz（立体声：-ac 2）
ffmpeg -i input.mkv -vn -ac 1 -ar 48000 -c:a pcm_s24le output.wav

# PCM 32-bit float（若原始音频即 32-bit float，用此格式避免精度损失）
ffmpeg -i input.mkv -vn -ac 2 -ar 48000 -c:a pcm_f32le output.wav
```

| 参数 | 作用 |
| --- | --- |
| `-vn` | 不输出视频 |
| `-ac 1/2` | 单声道 / 立体声 |
| `-ar 48000` | 采样率 48 kHz |
| `pcm_s24le` | 24-bit 整型 PCM |
| `pcm_f32le` | 32-bit 浮点 PCM |

> 32-bit float → 24-bit int 属于精度降级，不是无损转换；保留浮点请用 `pcm_f32le`。

## 3. 声道与采样率转换

```shell
# 立体声转单声道，重采样 44.1 kHz
ffmpeg -i input.wav -ac 1 -ar 44100 output_mono.wav

# 合成 5.1 中的左右声道
ffmpeg -i input.m4a -af "pan=stereo|FL=FC+FL|FR=FC+FR" output.wav
```

## 4. 调整音量

```shell
ffmpeg -i input.mp3 -af "volume=2.0" output.mp3      # 放大一倍
ffmpeg -i input.mp3 -af "volume=-6dB" output.mp3     # 降低 6 dB
ffmpeg -i input.mp3 -af "volume=0" output.mp3        # 静音
```

## 5. EBU R128 响度标准化

```shell
ffmpeg -i input.wav \
-af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" \
-c:a pcm_s24le output_final.wav
```

| 参数 | 含义 |
| --- | --- |
| `I=-16` | 目标综合响度（LUFS） |
| `TP=-1.5` | True Peak 上限（dBTP） |
| `LRA=11` | 目标响度范围 |

> 目标值按用途选择：播客常用 `-16`，流媒体平台常用 `-14`，不是所有场景的固定标准。

## 6. 查看响度 / 峰值信息

```shell
# 平均音量 / 最大音量（volumedetect）
ffmpeg -i input.wav -af volumedetect -f null -

# 精确的 EBU R128 响度测量（输出 I / TP / LRA）
ffmpeg -i input.wav -af loudnorm=print_format=summary -f null -
```

## 7. 混合多个音轨

```shell
ffmpeg -i audio1.mp3 -i audio2.mp3 \
-filter_complex "amix=inputs=2:duration=longest" \
output.mp3
```

> 混音后建议再做一次响度标准化。

## 8. 删除音频中的某段时间（总时长变短）

```shell
# 删除 05:10 ～ 05:15 之间的干扰
ffmpeg -i main.wav \
-filter_complex \
"[0:a]atrim=end=310[a1];[0:a]atrim=start=315[a2];[a1][a2]concat=n=2:v=0:a=1" \
output.wav
```

## 9. 静音某段时间（总时长不变，保持与画面同步）

```shell
ffmpeg -i main.wav \
-af "volume=enable='between(t,310,315)':volume=0" \
output.wav
```

| 方法 | 总时长 | 效果 |
| --- | --- | --- |
| `atrim + concat` | 缩短 | 真正删除片段 |
| `volume=0` | 不变 | 保留时间轴，仅静音 |

## 10. 音频变速不变调

```shell
# 音频 1.5 倍速
ffmpeg -i input.mp3 -af "atempo=1.5" output.mp3
```

## 11. 批量提取并标准化 MKV 音频（PowerShell）

```powershell
Get-ChildItem *.mkv | ForEach-Object {
    $outName = $_.BaseName + "_ready.wav"
    ffmpeg -i $_.FullName `
        -vn `
        -af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" `
        -ac 1 -c:a pcm_s24le `
        $outName
}
```

---

# 八、字幕与封面

## 1. MP4 烧录 ASS 硬字幕 + 添加封面

硬字幕会改变画面，视频必须重新编码；音频可继续复制。

```shell
ffmpeg -i input.mp4 \
-i cover.jpg \
-filter_complex "[0:v]ass=subtitle.ass[v]" \
-map "[v]" -map 0:a -map 1:v \
-c:v:0 libx264 -preset slow -crf 18 -pix_fmt yuv420p \
-c:a copy \
-c:v:1 mjpeg -disposition:v:1 attached_pic \
output.mp4
```

| 参数 | 作用 |
| --- | --- |
| `-filter_complex` | 构建复杂滤镜链 |
| `ass=subtitle.ass` | 烧录 ASS 字幕 |
| `-map "[v]"` | 使用处理后的主视频 |
| `-map 1:v` | 加入封面图片 |
| `-c:v:1 mjpeg` | 第二条视频流（封面）编码为 MJPEG |
| `-disposition:v:1 attached_pic` | 标记为封面 |

需要尽量贴近原视频码率时，把 `-crf 18` 替换为：

```shell
-b:v 6200k -maxrate 7000k -bufsize 12400k
```

## 2. MKV 添加软字幕和封面（全无损）

软字幕由播放器渲染，视频音频无需重编码：

```shell
ffmpeg -i input.mkv \
-i cover.jpg \
-i subtitle.ass \
-map 0:v -map 0:a -map 1:v -map 2:s \
-c copy \
-c:v:1 mjpeg -disposition:v:1 attached_pic \
output.mkv
```

## 3. 提取内封字幕

```shell
ffmpeg -i input.mkv -map 0:s:0 -c:s copy subtitle.ass
```

## 4. MP4 无损替换音频

```shell
ffmpeg -i video.mp4 -i audio.flac \
-map 0:v:0 -map 1:a:0 \
-c:v copy -c:a copy \
-shortest output.mp4
```

## 5. MP4 无损添加 / 缩放 MJPEG 封面

```shell
# 添加封面
ffmpeg -i input.mp4 -i cover.png \
-map 0 -map 1 -c copy \
-c:v:1 mjpeg -disposition:v:1 attached_pic \
output.mp4

# 封面缩放到宽 1500 再添加
ffmpeg -i input.mp4 -i cover.png \
-filter:v:1 "scale=1500:-1" \
-map 0:v -map 0:a -map 1:v \
-c:v copy -c:a copy \
-c:v:1 mjpeg -disposition:v:1 attached_pic \
output.mp4
```

---

# 九、GIF 制作

## 1. 基础方法

```shell
ffmpeg -ss 00:00:10 -to 00:00:15 \
-i input.mp4 \
-vf "fps=10,scale=320:-1:flags=lanczos" \
output.gif
```

> GIF 体积由帧率、分辨率、时长、颜色数共同决定。

## 2. 高质量 GIF：Palette 两步法

```shell
# STEP 1：生成调色板
ffmpeg -ss 00:00:10 -to 00:00:15 -i input.mp4 \
-vf "fps=10,scale=320:-1:flags=lanczos,palettegen" \
palette.png

# STEP 2：使用调色板生成 GIF
ffmpeg -ss 00:00:10 -to 00:00:15 -i input.mp4 -i palette.png \
-filter_complex "[0:v]fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse" \
output.gif
```

---

# 十、图片处理

## 1. 格式转换与缩放

```shell
ffmpeg -i input.jfif output.png            # 按扩展名自动选择格式
ffmpeg -i input.png -vf "scale=800:-1" output.png
```

## 2. 裁剪与水印

```shell
ffmpeg -i input.png -vf "crop=300:300:0:0" output.png      # 从左上角裁 300x300
ffmpeg -i input.png -i logo.png -filter_complex "overlay=10:10" output.png
```

## 3. JPEG 质量

```shell
ffmpeg -i input.png -q:v 2 -pix_fmt yuvj444p output.jpg
```

- `-q:v`：数值越小质量越高、文件越大；2～5 高质量，6～10 平衡
- 像素格式可选 `yuvj444p`（4:4:4）、`yuvj422p`（4:2:2）、`yuvj420p`（4:2:0）

## 4. PNG 压缩

```shell
ffmpeg -i input.jfif -compression_level 9 output.png
```

> PNG 无损，压缩等级只影响体积与速度。转 RGBA：`-vf "format=rgba"`（不会自动抠图）。

## 5. WebP

```shell
ffmpeg -i input.png -lossless 1 output.webp          # 无损
ffmpeg -i input.jpg -q:v 80 output.webp              # 有损
```

## 6. AVIF（基于 AV1）

```shell
ffmpeg -i input.jpg -c:v libsvtav1 -crf 20 output.avif
```

## 7. TIFF / BMP

```shell
ffmpeg -i input.png -compression_algo lzw output.tif
ffmpeg -i input.jpg -pix_fmt bgra output.bmp
```

---

# 十一、录屏与采集

## 1. Windows 录屏（需安装 screen-capture-recorder）

```shell
# 录制屏幕 + 系统声音
ffmpeg -f dshow -i video="screen-capture-recorder":audio="virtual-audio-capturer" \
-c:v libx264 -preset ultrafast -crf 23 -c:a aac output.mp4

# 录制屏幕 + 麦克风
ffmpeg -f dshow -i video="screen-capture-recorder":audio="麦克风 (Realtek Audio)" \
-c:v libx264 -preset ultrafast -crf 23 -c:a aac output.mp4

# 列出可用采集设备名称
ffmpeg -list_devices true -f dshow -i dummy
```

## 2. Linux / macOS

```shell
# Linux X11
ffmpeg -f x11grab -framerate 25 -video_size 1920x1080 -i :0.0 output.mp4

# macOS（先 ffmpeg -f avfoundation -list_devices true -i "" 查设备号）
ffmpeg -f avfoundation -i "1:0" output.mp4
```

---

# 十二元数据与杂项

## 1. 添加 / 清除元数据

```shell
# 添加标题元数据
ffmpeg -i input.mp4 -c copy -metadata title="我的视频" output.mp4

# 清除全部元数据
ffmpeg -i input.mp4 -c copy -map_metadata -1 output.mp4

# 标记音轨语言
ffmpeg -i input.mkv -c copy -metadata:s:a:0 language=chi output.mkv
```

## 2. 多线程

大多数编码器默认自动多线程（`-threads 0`），一般无需手动设置；线程数并非越大越快。

## 3. Windows CMD 换行符

本文使用 `\` 换行（shell）。Windows CMD 中需换成 `^`，PowerShell 中换成 `` ` ``，或写成一行。

---

# 十三、Windows 批处理

## 1. 批量 JFIF → PNG

```bat
@echo off
for %%f in (*.jfif) do ffmpeg -i "%%f" "%%~nf.png"
```

直接在 CMD 中执行（单 `%`）：

```cmd
for %f in (*.jfif) do ffmpeg -i "%f" "%~nf.png"
```

## 2. 批量 MP4 → H.265（PowerShell）

```powershell
Get-ChildItem *.mp4 | ForEach-Object {
    ffmpeg -i $_.FullName -c:v libx265 -crf 26 -tag:v hvc1 -c:a copy ($_.BaseName + "_h265.mp4")
}
```

---

# 十四、本地帮助

```shell
ffmpeg -h                    # 简略帮助
ffmpeg -h filter=crop        # 具体滤镜帮助
ffmpeg -h encoder=libx264    # 具体编码器帮助
ffmpeg -filters              # 全部滤镜
ffmpeg -codecs               # 全部编解码器
ffmpeg -encoders             # 全部编码器
ffmpeg -formats              # 全部封装格式
ffmpeg -pix_fmts             # 全部像素格式
```

> 往本手册追加新条目时，按"功能名称 → 最常用命令 → 参数说明 → 注意事项"的结构组织，保持可查性。
