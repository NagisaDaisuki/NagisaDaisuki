---
title: AVFrame-未压缩的原始数据
published: 2026-10-31
description: 可能是比较简单理解的一环
image: ./cover.jpg
tags: ["FFmpeg", "AVFrame"]
category: FFmpeg
author: Akeboshi Himari
draft: false
---

`AVFrame`是 FFmpeg中最核心的结构体之一。如果说`AVPacket`是 **“压缩后的数据包”**，那么`AVFrame`就是 **“解码后的原始数据（未压缩）”**。

# 1. 核心定义与生命周期

`AVFrame` 描述了一段原始的音频或视频数据。它的生命周期通常遵循以下流程：

1. **分配**：`av_frame_alloc()`分配结构体内存（_此时不分配数据内存_）。

2. **赋参数**：设置`width`、`height`、`format` 等。

3. **分配数据内存**：`av_frame_get_buffer()` 根据参数分配真正的数据内存。

4. **接收数据**：作为参数传给 `avcodec_receive_frame()` 接收解码数据，或自己往里面填数据。

5. **使用/引用**：在滤镜、重采样或渲染中使用。

6. **释放**：`av_frame_unref()`释放内部数据引用（重置状态），最后用 `av_frame_free()` 释放结构体本身。

# 2. 内存模型（最关键的部分）

```c
uint8_t *data[AV_NUM_DATA_POINTERS];       // 指向真实数据的裸指针数组
int linesize[AV_NUM_DATA_POINTERS];        // 每行的字节数（内存对齐）
uint8_t **extended_data;                   // 扩展数据指针，音频多声道时必用
AVBufferRef *buf[AV_NUM_DATA_POINTERS];    // 数据内存的“管家”
AVBufferRef *private_ref;                  // 私有数据（如 QP 表）的引用
```

- `data` **和** `extended_data`：
  - **视频**：一般只有 1~4 个平面。比如`YUV420P`有 3 个平面，`data[0]`是Y，`data[1]`是U，`data[2]`是V。此时`extended_data`就等于`data`。

  - **音频**：如果是 Packed 格式（如 `s16` 交错），只有 1 个平面 `data[0]`；如果是 Planar 格式（如 `fltp` 平面），每个声道占一个平面。**如果声道数大于 8 个**，`data`数组不够用，FFmpeg 就会分配一个新的指针数组给 `extended_data`，此时`extended_data`才是完整的数据指针集合。

- **linesize（步长/对齐）**：

  - 因为 CPU 的 SIMD 指令要求内存对齐，所以 FFmpeg 分配内存时，每一行（或每个平面）的宽度会被向上取整到 32 或 64 的倍数。

  - 永远不要用 `width * height` 去遍历像素，必须配合 `linesize` 逐行访问：`frame->data[0][y * frame->linesize[0] + x]`。

- `buf` **与引用计数**：

  - 前面提到过，`data`指向内存，而`buf`是这块内存的产权证（`AVBufferRef`）。当 `AVFrame`被复制（如`av_frame_ref`）时，底层数据不会拷贝，只会把`buf`里的引用计数 +1。当引用归零时，内存自动释放。

# 3. 核心字段分类解析

除了内存指针，`AVFrame`还有大量的元数据字段：

**视频专属**

- `int width, height;`：视频的宽高。
- `int format;`：像素格式（对应枚举 AVPixelFormat，如 AV_PIX_FMT_YUV420P）。
- `AVRational sample_aspect_ratio;`：像素宽高比（SAR），用于计算显示比例。
- `int key_frame;`：是否为关键帧（I 帧）。
- `enum AVPictureType pict_type;`：帧类型（I、P、B 帧）。

**音频专属**

- `int nb_samples;`：当前帧包含的每个声道的采样点数（比如 AAC 通常是 1024）。
- `int sample_rate;`：采样率（如 44100, 48000）。
- `int channels;`：声道数（如 2）。
- `uint64_t channel_layout;`：声道布局（如立体声、5.1 环绕声）。

**时间戳**

- `int64_t pts;`：显示时间戳。决定这一帧在什么时候被播放。
- `int64_t pkt_dts;`：解码时间戳。通常从触发该帧的 AVPacket 原样拷贝而来。
- `int64_t pkt_duration;`：这一帧持续的时间（刻度值）。

**元数据与状态**

- `int64_t best_effort_timestamp;`：FFmpeg 帮你估算出的最合理的时间戳（当 pts 缺失时特别有用）。
- `int flags;`：包含很多标志位，比如AV_FRAME_FLAG_CORRUPT（数据损坏）、AV_FRAME_FLAG_KEY（关键帧）。
- `AVDictionary *metadata;`：该帧自带的元数据。
- `void *opaque;`：用户自定义的私有指针。你可以把自定义的业务数据挂在这里，av_frame_ref 时它会被自动拷贝。

# 4. Writable（可写性） 与 `av_frame_make_writable()`

因为`AVFrame`底层有引用计数，很多时候你拿到的`AVFrame`（比如滤镜的输出，或者多线程共享的帧）**正在被其他模块使用**。如果你直接修改它的像素（比如画个框），可能会导致其他地方花屏，甚至引发段错误。

**规则：在直接修改 frame->data 之前，必须调用 `av_frame_make_writable(frame)`**。

- 这个函数会检查`buf`的引用计数。如果引用计数为 1（只有你在用），它直接返回 0，允许你修改。
- 如果引用计数 > 1（有其他人在用），它会在底层 **偷偷帮你`malloc` 一块新内存，把旧数据拷过去，并让当前 Frame 指向新内存**（写时复制 Copy-on-Write 机制）。这样你修改新内存，就不会影响别人了。

# 5. 音频/视频访问示例

**视频遍历像素（安全写法）**:

```c
// 假设是 YUV420P
uint8_t *y_plane = frame->data[0];
for (int y = 0; y < frame->height; ++y){
  for (int x = 0; x < frame->width; ++x){
    uint8_t pixel_value = y_plane[y * frame->linesize[0] + x];
  }
}
```

**音频遍历采样（安全写法）**:

```c
// 假设是立体声 fltp（平面浮点格式)
int nb_samples = frame->nb_samples;
float *left_channel = (float*)frame->extended_data[0];
float *right_channel = (float*)frame->extended_data[1];

for (int i = 0; i < nb_samples; ++i){
  float l = left_channel[i];
  float r = right_channel[i];
}
```

# 6. 常见 API 总结

|         函数          |                                              作用                                               |
| :-------------------: | :---------------------------------------------------------------------------------------------: |
|   av_frame_alloc()    |                仅分配结构体本身（除 default 字段外，其他清零），不分配数据内存。                |
| av_frame_get_buffer() |           根据设定的宽、高、格式，分配底层数据内存，并自动设置好buf 引用和 linesize。           |
|    av_frame_ref()     |                         浅拷贝。两个 Frame 共享底层数据，引用计数 +1。                          |
|   av_frame_unref()    | 解除对底层数据的引用，引用计数 -1。此函数调用后，Frame 被清空，可重复使用（不需要重新 alloc）。 |
|   av_frame_clone()    |                       相当于 alloc + ref，创建一个新的共享数据的 Frame。                        |
|    av_frame_copy()    |   深拷贝。把源 Frame 的像素/音频数据逐字节复制到目标 Frame（目标 Frame 必须已经分配好内存）。   |
