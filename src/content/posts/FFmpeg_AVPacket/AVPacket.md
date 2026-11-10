---
title: AVPacket-压缩后的编码数据包
published: 2026-11-10
description: FFmpeg AVPacket 结构体分析：压缩数据的生命周期、内存模型、时间戳与引用计数机制
image: ./Cover.jpg
tags: ["FFmpeg", "AVPacket"]
category: FFmpeg
draft: false
---

`AVPacket` 是 FFmpeg 中描述 **“压缩后的数据包”** 的核心结构体。如果说 `AVFrame` 是 **“解码后的原始数据（未压缩）”**，那么 `AVPacket` 就是 **“解码前的压缩数据（编码流）”**。它承载的是一帧或多帧的编码码流（H.264/H.265/AAC 等），是解复用器（demuxer）输出给解码器、以及编码器输出给复用器（muxer）的基本单位。

# 1. 核心定义与生命周期

`AVPacket` 描述了一段压缩的音视频码流。它的生命周期通常遵循以下流程：

1. **分配**：`av_packet_alloc()` 分配结构体内存（_此时不分配数据内存_）。

2. **接收数据**：作为参数传给 `av_read_frame()`，从输入文件/流中读取一包压缩数据；或作为 `avcodec_receive_packet()` 的参数，接收编码器的输出。

3. **送入解码/写出**：作为 `avcodec_send_packet()` 的参数送入解码器；或直接传给 `av_interleaved_write_frame()` 写入输出文件。

4. **释放**：`av_packet_unref()` 释放内部数据引用（重置状态），最后用 `av_packet_free()` 释放结构体本身。

> 注意一个常见误区：`av_read_frame()` 返回的 packet 数据由 FFmpeg 内部分配，**调用方不需要也不应该自己去 malloc 数据区**，用完 `av_packet_unref()` 即可。

# 2. 内存模型（最关键的部分）

```c
uint8_t *data;                  // 指向压缩数据的裸指针
int      size;                  // 数据的字节长度
AVBufferRef *buf;               // 数据内存的“管家”（引用计数）
int64_t  pos;                   // 该包在输入文件中的字节偏移
AVDictionary *metadata;         // 包级元数据
```

- **`data` 与 `size`**：
  - 与 `AVFrame` 的多平面 `data[AV_NUM_DATA_POINTERS]` 不同，`AVPacket` 只有 **一个连续的 `data` 指针**。压缩码流本身就是一整块字节，没有平面（plane）的概念。
  - `size` 是数据的真实字节数。遍历方式就是朴素的 `data[i]`，不存在 `linesize` 对齐问题。

- **`buf` 与引用计数**：
  - `buf` 是这块内存的产权证（`AVBufferRef`）。当 `AVPacket` 被 `av_packet_ref()` 复制时，底层数据不会拷贝，只会把引用计数 +1；引用归零时内存自动释放。
  - 这就是为什么 FFmpeg 内部（解码器缓冲队列等）可以随意保存 packet 而不用担心内存泄漏。

- **`AV_INPUT_BUFFER_PADDING_SIZE`（解码器的隐藏要求）**：
  - FFmpeg 的解码器（尤其是使用 SIMD 优化的那些）会一次性读取多个字节，因此要求 packet 的 `data` 在 `size` 之后还有 **`AV_INPUT_BUFFER_PADDING_SIZE`（至少 64 字节，新版本）** 的额外可读填充区，内容必须为 0。
  - 通过 `av_read_frame()` / `av_packet_ref()` 拿到的 packet 会自动满足这个要求；但如果 **自己手动构造 packet**（例如自己 malloc data 喂给解码器），必须自己保证 padding，否则可能随机崩溃。

# 3. 核心字段分类解析

除了内存指针，`AVPacket` 还有以下重要字段：

**归属与标识**

- `int stream_index;`：该包属于输入文件中的第几路流（对应 `AVFormatContext->streams[]` 的下标）。**这是把“包”和“流”关联起来的唯一线索**，处理多路音视频时必须用它分流。
- `AVRational time_base;`（新版字段）：该包时间戳的时间基准，仅在极少场景下使用，通常时间基准以流的 `AVStream->time_base` 为准。

**时间戳（音视频同步的核心）**

- `int64_t pts;`：显示时间戳（Presentation TimeStamp）。决定这一帧在什么时候被播放。
- `int64_t dts;`：解码时间戳（Decoding TimeStamp）。解码器按 dts 顺序消费数据；当码流没有 B 帧时，`pts == dts`。
- `int64_t duration;`：该包持续时间（以 time_base 为刻度）。
- > 关键关系：**pts/dts 的刻度是流级 time_base，不是秒**。换算成秒要 `pts * av_q2d(stream->time_base)`；跨容器/跨流传递时用 `av_packet_rescale_ts()` 转换刻度。

**标志位 `flags`**

- `AV_PKT_FLAG_KEY`：关键帧标志。seek 只能跳到关键帧。
- `AV_PKT_FLAG_CORRUPT`：数据损坏。
- `AV_PKT_FLAG_DISCARD`：应丢弃（如冗余帧）。
- `AV_PKT_FLAG_TRUSTED` / `AV_PKT_FLAG_DISPOSABLE` 等较少使用。

**副数据（Side Data）**

- `AVPacketSideData *side_data;` 与 `int side_data_elems;`：附着在码流之外、复用器/解码器需要的辅助信息。例如：
  - `AV_PKT_DATA_MATROSKA_SIDEDATA`（字幕/章节附加信息）
  - `AV_PKT_DATA_SKIP_SAMPLES`（音频首帧跳过的采样数，AAC 编码器延迟补齐的关键）
  - `AV_PKT_DATA_PARAM_CHANGE`（流中途参数变化）
  - `AV_PKT_DATA_H265_MPEG_CONFIG` 等。
  - 可通过 `av_packet_get_side_data()` 按类型查找，`av_packet_new_side_data()` 添加。

**用户私有数据**

- `void *opaque;` 与 `AVBufferRef *opaque_ref;`：用户自定义私有指针/引用。业务数据可挂在这里，`av_packet_ref` 时会跟随拷贝（`opaque_ref` 带引用计数，`opaque` 只是裸指针）。

# 4. 时间戳与 `av_packet_rescale_ts()`

packet 的时间戳贯穿整个转码流程，最容易被搞错的就是**刻度转换**：

```c
// 从输入流读出的 packet，时间戳基于输入流的 time_base
// 要写入输出文件前，必须转换成输出流的 time_base
av_packet_rescale_ts(pkt,
                     in_stream->time_base,   // 源刻度
                     out_stream->time_base); // 目标刻度
```

- 漏掉这一步是转码后**音画不同步、播放器显示时长错误**的头号原因。
- 另外注意：编码器输出的 packet 时间戳基于编码器的 `time_base`（通常 `1/sample_rate` 或 `1/frame_rate`），写入 muxer 前同样要 rescale。

# 5. Writable（可写性）与 `av_packet_make_writable()`

与 `AVFrame` 的写时复制机制一样，由于 `AVPacket` 底层有引用计数，多处共享的 packet 不能直接改 `data` 内容。

**规则：在直接修改 pkt->data 之前，必须调用 `av_packet_make_writable(pkt)`。**

- 引用计数为 1 时直接返回 0，允许修改；
- 引用计数 > 1 时会在底层 **重新分配内存并拷贝数据**，让当前 packet 独占新内存（Copy-on-Write）。

典型场景：自己给裸流“打头”（比如给 H.264 裸码流插入起始码、封装 TS 包）前，先 make_writable 再改。

# 6. 音频/视频访问示例

**遍历压缩数据字节**:

```c
for (int i = 0; i < pkt->size; ++i) {
  uint8_t byte = pkt->data[i];
  // 例如扫描 H.264 NALU 起始码 0x000001
}
```

**标准读取-解码循环**:

```c
AVPacket *pkt = av_packet_alloc();
while (av_read_frame(fmt_ctx, pkt) >= 0) {
  if (pkt->stream_index == video_stream_idx) {
    // 关键帧可用于打印/seek 参考
    if (pkt->flags & AV_PKT_FLAG_KEY)
      printf("keyframe pts=%ld\n", pkt->pts);

    avcodec_send_packet(decoder, pkt);
    // ... avcodec_receive_frame() ...
  }
  av_packet_unref(pkt);  // 每次循环必须 unref，否则内存泄漏
}
av_packet_free(&pkt);
```

# 7. 常见 API 总结

|           函数            |                                           作用                                            |
| :-----------------------: | :---------------------------------------------------------------------------------------: |
|     av_packet_alloc()     |                        仅分配结构体本身（清零），不分配数据内存。                         |
|      av_packet_ref()      |                      浅拷贝。两个 Packet 共享底层数据，引用计数 +1。                      |
|     av_packet_unref()     | 解除对底层数据的引用，引用计数 -1。调用后 Packet 被清空，可重复使用（不需要重新 alloc）。 |
|     av_packet_clone()     |                    相当于 alloc + ref，创建一个新的共享数据的 Packet。                    |
|   av_packet_move_ref()    |        转移所有权。把 src 的所有字段搬到 dst 并清空 src，引用计数不变（零拷贝）。         |
|  av_packet_copy_props()   |            只拷贝元数据（pts/dts/flags/side_data 等），不拷贝 data 数据本身。             |
| av_packet_make_writable() |                写时复制。确保当前 Packet 独占数据内存，允许直接修改 data。                |
|  av_packet_rescale_ts()   |                把 pts/dts/duration 从一个 time_base 刻度换算到另一个刻度。                |
|     av_packet_free()      |                              相当于 unref + 释放结构体本身。                              |

# 8. AVPacket 与 AVFrame 的对照

|   维度   |            AVPacket            |             AVFrame              |
| :------: | :----------------------------: | :------------------------------: |
| 数据状态 |       压缩后（编码码流）       |      未压缩（原始像素/PCM）      |
| 内存布局 |  一块连续内存（单 data 指针）  |  多平面 data[] + linesize 对齐   |
| 主要来源 |   av_read_frame / 编码器输出   |   avcodec_receive_frame / 滤镜   |
| 主要去向 |    解码器输入 / muxer 写出     |     渲染、重采样、编码器输入     |
|  时间戳  | pts + dts（可能不等，有 B 帧） |      pts（+ pkt_dts 溯源）       |
| 关键 API |    ref/unref/make_writable     |     ref/unref/make_writable      |
| 解码关系 |  `avcodec_send_packet(pkt)` →  | → `avcodec_receive_frame(frame)` |
