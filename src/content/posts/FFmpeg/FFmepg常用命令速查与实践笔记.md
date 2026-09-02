---
title: FFmepg常用命令速查与实践笔记
published: 2025-09-02
description: "Was it a cat i saw!?"
category: FFmpeg 
image: "./cover.jpg"
tags: ["FFmpeg", "ffmpeg", "video", "audio", "tools"]
author: Akeboshi Himari
draft: false
--- 

# FFmpeg 常用命令速查与实践笔记

> 一份以**实际音视频处理工作流**为中心的 FFmpeg 笔记。  
> 重点覆盖：视频转码 / 裁剪 / 截图 / GIF、音频提取 / PCM / 响度标准化 / 裁剪静音、封面与字幕、图片处理，以及常用参数速查。

---

## 📚 目录

- [FFmpeg 常用命令速查与实践笔记](#ffmpeg-常用命令速查与实践笔记)
  - [📚 目录](#-目录)
- [一、基础概念](#一基础概念)
  - [1. 封装格式（Container）](#1-封装格式container)
  - [2. 流（Stream）](#2-流stream)
  - [3. 编码器 / 解码器（Codec）](#3-编码器--解码器codec)
  - [4. Frame 的两个语境](#4-frame-的两个语境)
- [二、视频处理](#二视频处理)
  - [1. 转码为 MP4](#1-转码为-mp4)
    - [基础写法](#基础写法)
    - [添加常用编码参数](#添加常用编码参数)
  - [2. 无损裁剪视频](#2-无损裁剪视频)
    - [⚠️ 注意](#️-注意)
  - [3. 修改分辨率](#3-修改分辨率)
  - [4. 精确截取时间段并重新编码](#4-精确截取时间段并重新编码)
  - [5. 调整播放速度](#5-调整播放速度)
    - [快 2 倍](#快-2-倍)
    - [慢 0.5 倍](#慢-05-倍)
  - [6. 自动检测并裁剪黑边](#6-自动检测并裁剪黑边)
    - [第一步：检测黑边](#第一步检测黑边)
    - [第二步：填入检测结果](#第二步填入检测结果)
  - [7. 手动裁剪视频](#7-手动裁剪视频)
- [三、音频处理](#三音频处理)
  - [1. 提取音频](#1-提取音频)
    - [直接复制原始音频流](#直接复制原始音频流)
  - [2. MKV 中提取 PCM 音频](#2-mkv-中提取-pcm-音频)
    - [导出为 PCM 24-bit WAV](#导出为-pcm-24-bit-wav)
    - [导出为 PCM 32-bit float WAV](#导出为-pcm-32-bit-float-wav)
    - [⚠️ 24-bit 与 32-bit Float](#️-24-bit-与-32-bit-float)
  - [3. 转换为 MP3](#3-转换为-mp3)
  - [4. 调整音量](#4-调整音量)
  - [5. 混合多个音轨](#5-混合多个音轨)
  - [6. EBU R128 响度标准化](#6-ebu-r128-响度标准化)
    - [基础标准化](#基础标准化)
    - [从录像中提取音频并直接标准化](#从录像中提取音频并直接标准化)
  - [7. 混音完成后归一化](#7-混音完成后归一化)
  - [8. 精确删除音频片段](#8-精确删除音频片段)
  - [9. 静音指定时间段](#9-静音指定时间段)
  - [10. 查看音频响度 / 峰值信息](#10-查看音频响度--峰值信息)
  - [11. 批量提取并标准化 MKV 音频](#11-批量提取并标准化-mkv-音频)
- [四、图片处理](#四图片处理)
  - [1. 视频截图](#1-视频截图)
  - [2. NVIDIA GPU 加速截图](#2-nvidia-gpu-加速截图)
  - [3. AV1 转 H.264 后截图](#3-av1-转-h264-后截图)
    - [使用 libdav1d 解码 + NVENC 编码](#使用-libdav1d-解码--nvenc-编码)
    - [使用 libaom-av1](#使用-libaom-av1)
  - [4. 图片格式转换](#4-图片格式转换)
  - [5. 修改图片尺寸](#5-修改图片尺寸)
  - [6. PNG 压缩](#6-png-压缩)
  - [7. 裁剪图片](#7-裁剪图片)
  - [8. 添加水印 / 叠加图层](#8-添加水印--叠加图层)
  - [9. 转换为带 Alpha 的 PNG](#9-转换为带-alpha-的-png)
  - [10. 修改像素格式](#10-修改像素格式)
  - [11. JPG / JPEG 质量参数](#11-jpg--jpeg-质量参数)
    - [`-q:v`](#-qv)
    - [JPEG 像素格式](#jpeg-像素格式)
  - [12. WebP](#12-webp)
    - [无损 WebP](#无损-webp)
    - [有损 WebP](#有损-webp)
    - [压缩等级](#压缩等级)
  - [13. AVIF](#13-avif)
  - [14. TIFF](#14-tiff)
  - [15. BMP](#15-bmp)
- [五、字幕与封面](#五字幕与封面)
  - [1. MP4 烧录 ASS 硬字幕 + 添加封面](#1-mp4-烧录-ass-硬字幕--添加封面)
    - [方法一：一次完成](#方法一一次完成)
    - [参数说明](#参数说明)
  - [2. 尽量保持原视频码率](#2-尽量保持原视频码率)
    - [码率参数](#码率参数)
  - [3. MKV 添加软字幕和封面](#3-mkv-添加软字幕和封面)
  - [4. MP4 无损替换音频](#4-mp4-无损替换音频)
  - [5. 重新编码封面尺寸](#5-重新编码封面尺寸)
    - [Windows CMD](#windows-cmd)
  - [6. MP4 无损添加 MJPEG 封面](#6-mp4-无损添加-mjpeg-封面)
- [六、图片 + 音频制作视频](#六图片--音频制作视频)
- [七、GIF 制作](#七gif-制作)
  - [1. 基础方法](#1-基础方法)
  - [2. 高质量 GIF：Palette 两步法](#2-高质量-gifpalette-两步法)
    - [STEP 1：生成调色板](#step-1生成调色板)
    - [STEP 2：使用调色板](#step-2使用调色板)
    - [GIF 循环](#gif-循环)
  - [3. `-ss` 的位置](#3--ss-的位置)
    - [`-ss` 放在 `-i` 前](#-ss-放在--i-前)
    - [`-ss` 放在 `-i` 后](#-ss-放在--i-后)
- [八、纯音频生成黑场视频](#八纯音频生成黑场视频)
  - [关键参数](#关键参数)
- [九、其它常用参数](#九其它常用参数)
  - [1. 多线程](#1-多线程)
  - [2. `-preset`](#2--preset)
  - [3. `-c copy`](#3--c-copy)
  - [4. `-map`](#4--map)
- [十、本地帮助](#十本地帮助)
- [十一、Windows 批处理](#十一windows-批处理)
  - [1. 批量 JFIF → PNG](#1-批量-jfif--png)
    - [`.bat` 文件](#bat-文件)
    - [直接在 CMD 中执行](#直接在-cmd-中执行)
- [十二、常用工作流速查](#十二常用工作流速查)
  - [🎵 A. MKV → 24-bit / 48 kHz WAV](#-a-mkv--24-bit--48-khz-wav)
    - [单声道](#单声道)
    - [立体声](#立体声)
  - [🎵 B. MKV → 32-bit Float / 48 kHz WAV](#-b-mkv--32-bit-float--48-khz-wav)
  - [🎚 C. 提取 → 响度标准化 → 24-bit WAV](#-c-提取--响度标准化--24-bit-wav)
  - [✂️ D. 删除音频中的一段干扰](#️-d-删除音频中的一段干扰)
  - [🔇 E. 不改变时长，只静音干扰](#-e-不改变时长只静音干扰)
  - [🎞 F. 自动检测视频黑边](#-f-自动检测视频黑边)
  - [📱 G. 裁成 9:16 竖屏](#-g-裁成-916-竖屏)
  - [📝 H. MP4 烧录 ASS + 添加封面](#-h-mp4-烧录-ass--添加封面)
  - [💿 I. MP4 无损替换音频](#-i-mp4-无损替换音频)
  - [🖼 J. 图片 + 音频 → MP4](#-j-图片--音频--mp4)
  - [🎬 K. 视频片段 → 高质量 GIF](#-k-视频片段--高质量-gif)
    - [生成调色板](#生成调色板)
    - [生成 GIF](#生成-gif)
- [🧭 个人使用建议](#-个人使用建议)
  - [参数说明](#参数说明-1)
  - [注意事项](#注意事项)
  - [Windows / PowerShell 版本](#windows--powershell-版本)

---

# 一、基础概念

FFmpeg 是一个强大的开源音视频处理工具，包含大量组件和扩展库。相比桌面视频处理软件，很多重复性的音视频处理任务直接使用 FFmpeg 命令行会更加简洁、高效，也非常适合批处理。

## 1. 封装格式（Container）

**封装格式**可以理解为一个“容器”，负责把视频、音频、字幕、章节、封面等不同数据组织到同一个文件中。

常见封装格式：

- `MP4`
- `MKV`
- `MOV`
- `AVI`
- `WebM`

> **封装格式 ≠ 编码格式。**  
> 例如 `MP4` 可以封装 H.264 + AAC，也可以封装 H.265 + FLAC；`MKV` 同样可以容纳多种视频、音频和字幕流。

## 2. 流（Stream）

一个媒体文件可以包含多个独立的流：

```text
movie.mkv
├── Video Stream 0
├── Audio Stream 0
├── Audio Stream 1
├── Subtitle Stream 0
└── Attachment / Cover
```

FFmpeg 的很多操作，本质上就是：

- 选择流（`-map`）
- 提取流
- 复制流（`-c copy`）
- 转码流
- 合并多个流
- 重新封装

## 3. 编码器 / 解码器（Codec）

**编码器**负责把原始音视频数据编码成某种格式；**解码器**负责将其还原为可处理的数据。

常见视频编码：

- H.264 / AVC
- H.265 / HEVC
- AV1
- VP9

常见音频编码：

- AAC
- Opus
- MP3
- FLAC
- PCM

## 4. Frame 的两个语境

“帧”在视频和音频中含义并不完全一样：

- **视频帧**：通常指一张图像。
- **音频帧**：指编码器处理的一组音频采样，并不等同于一张“声音图片”。

视频编码中常见：

- `I-frame`：关键帧
- `P-frame`：预测帧
- `B-frame`：双向预测帧

---

# 二、视频处理

## 1. 转码为 MP4

### 基础写法

```shell
ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
```

### 添加常用编码参数

```shell
ffmpeg -i input.mov \
-c:v libx264 -c:a aac \
-preset medium -crf 23 \
output.mp4
```

参数：

| 参数 | 作用 |
| --- | --- |
| `-c:v` | 指定视频编码器 |
| `-c:a` | 指定音频编码器 |
| `libx264` | H.264 编码器 |
| `aac` | AAC 音频编码器 |
| `-crf 23` | H.264 恒定质量参数 |
| `-preset medium` | 编码速度 / 压缩效率平衡 |

> H.264 使用 `CRF` 时，**数值越低通常质量越高、文件越大**。

---

## 2. 无损裁剪视频

```shell
ffmpeg -ss 00:00:10 -i input.mp4 -t 00:00:20 -c copy output.mp4
```

- `-ss`：起始时间
- `-t`：持续时间
- `-c copy`：直接复制音视频流，不重新编码

### ⚠️ 注意

`-c copy` 裁剪速度非常快，但视频切点通常受**关键帧**影响，因此不一定能做到逐帧精确。

如果需要精确切点，应使用重新编码的方法。

---

## 3. 修改分辨率

```shell
ffmpeg -i input.mp4 -vf "scale=1280:720" output_720p.mp4
```

保持比例：

```shell
ffmpeg -i input.mp4 -vf "scale=1280:-1" output.mp4
```

其中 `-1` 表示让 FFmpeg 根据原始比例自动计算另一边。

---

## 4. 精确截取时间段并重新编码

```shell
ffmpeg -ss 00:01:00 -to 00:02:00 \
-i input.mp4 \
-c:v libx264 -c:a aac \
output.mp4
```

如果非常强调时间点的精确性，可以将 `-ss` 放在 `-i` 后面，让 FFmpeg 从输入开头解码到目标位置，但速度会更慢。

---

## 5. 调整播放速度

### 快 2 倍

```shell
ffmpeg -i input.mp4 \
-vf "setpts=0.5*PTS" \
output_fast.mp4
```

### 慢 0.5 倍

```shell
ffmpeg -i input.mp4 \
-vf "setpts=2.0*PTS" \
output_slow.mp4
```

> `setpts` 只改变视频时间轴。  
> 如果同时需要调整音频速度，需要额外使用 `atempo`。

---

## 6. 自动检测并裁剪黑边

### 第一步：检测黑边

```shell
ffmpeg -i ".\2026-04-12 18-25-31.mkv" \
-vf cropdetect \
-f null -
```

在输出日志中寻找类似：

```text
crop=608:1080:656:0
```

四个参数分别是：

```text
crop=宽度:高度:x:y
```

### 第二步：填入检测结果

```shell
ffmpeg -i ".\2026-04-12 18-25-31.mkv" \
-vf "crop=608:1080:656:0" \
-c:a copy \
output.mkv
```

> 因为使用了 `crop` 视频滤镜，所以**视频必须重新编码**；`-c:a copy` 只能保证音频流直接复制。

---

## 7. 手动裁剪视频

例如保持整个高度，只把视频裁成 **9:16**：

```shell
ffmpeg -i input.mkv \
-vf "crop=ih*9/16:ih" \
-c:a copy \
output.mkv
```

这里：

```text
ih       = Input Height，输入高度
ih*9/16  = 根据高度计算 9:16 的宽度
```

因此：

```text
crop=ih*9/16:ih
```

表示：

> 高度保持原样，宽度根据高度计算为 9:16。

---

# 三、音频处理

## 1. 提取音频

### 直接复制原始音频流

```shell
ffmpeg -i input.mp4 \
-vn \
-c:a copy \
output.aac
```

- `-vn`：不处理视频流
- `-c:a copy`：直接复制音频流，不重新编码

> 只有当输出容器 / 文件格式与原音频编码兼容时，才适合直接 `-c:a copy`。

---

## 2. MKV 中提取 PCM 音频

假设 MKV 内部音频为：

```text
PCM 32-bit float
48 kHz
```

### 导出为 PCM 24-bit WAV

```shell
ffmpeg -i input.mkv \
-vn \
-ac 1 \
-ar 48000 \
-c:a pcm_s24le \
output.wav
```

立体声：

```shell
ffmpeg -i input.mkv \
-vn \
-ac 2 \
-ar 48000 \
-c:a pcm_s24le \
output.wav
```

### 导出为 PCM 32-bit float WAV

```shell
ffmpeg -i input.mkv \
-vn \
-ac 1 \
-ar 48000 \
-c:a pcm_f32le \
output.wav
```

立体声：

```shell
ffmpeg -i input.mkv \
-vn \
-ac 2 \
-ar 48000 \
-c:a pcm_f32le \
output.wav
```

参数：

| 参数 | 作用 |
| --- | --- |
| `-vn` | 不输出视频 |
| `-ac 1` | 单声道 |
| `-ac 2` | 双声道 / 立体声 |
| `-ar 48000` | 48 kHz |
| `pcm_s24le` | PCM signed 24-bit little-endian |
| `pcm_f32le` | PCM 32-bit float little-endian |

### ⚠️ 24-bit 与 32-bit Float

如果原始音频本身是 `32-bit float`：

```text
32-bit float → 24-bit integer
```

这不是“无损转换”，而是改变了采样格式。

如果希望尽可能保持原始浮点数据，则使用：

```shell
-c:a pcm_f32le
```

---

## 3. 转换为 MP3

```shell
ffmpeg -i input.aac output.mp3
```

如需控制 MP3 质量，可以进一步指定编码器和码率。

---

## 4. 调整音量

放大一倍：

```shell
ffmpeg -i input.mp3 \
-af "volume=2.0" \
output.mp3
```

---

## 5. 混合多个音轨

```shell
ffmpeg -i audio1.mp3 -i audio2.mp3 \
-filter_complex "amix=inputs=2:duration=longest" \
output.mp3
```

其中：

- `inputs=2`：混合两个输入
- `duration=longest`：输出持续时间取最长输入

---

## 6. EBU R128 响度标准化

### 基础标准化

```shell
ffmpeg -i input.wav \
-af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" \
-c:a pcm_s24le \
output_final.wav
```

常用参数：

| 参数 | 含义 |
| --- | --- |
| `I=-16` | 目标综合响度 |
| `TP=-1.5` | True Peak 上限 |
| `LRA=11` | 目标响度范围 |
| `aresample=48000` | 重采样到 48 kHz |

### 从录像中提取音频并直接标准化

```shell
ffmpeg -i ".\你的录像文件.mkv" \
-vn \
-af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" \
-ac 1 \
-c:a pcm_s24le \
output_final.wav
```

---

## 7. 混音完成后归一化

例如混音文件已经完成：

```shell
ffmpeg -i "你的混音导出文件.wav" \
-af "loudnorm=I=-14:LRA=11:TP=-1.0" \
-ar 48000 \
"最终成品.wav"
```

> `-16 LUFS`、`-14 LUFS` 等目标值应根据最终用途选择，不要把某一个数值理解成所有场景的固定标准。

---

## 8. 精确删除音频片段

假设：

```text
00:05:10 ～ 00:05:15
```

之间存在需要删除的干扰。

即：

```text
0 ───── 310s      315s ───── 结尾
       删除这里
```

可以使用 `atrim + concat`：

```shell
ffmpeg -i main.wav \
-filter_complex \
"[0:a]atrim=end=310[a1]; \
 [0:a]atrim=start=315[a2]; \
 [a1][a2]concat=n=2:v=0:a=1" \
output.wav
```

优点：

- 不需要手动计算文件位置
- 逻辑清晰
- 可以精确控制时间
- 删除后会缩短总时长

---

## 9. 静音指定时间段

如果不能改变总时长，例如必须与视频画面保持同步：

```shell
ffmpeg -i main.wav \
-af "volume=enable='between(t,310,315)':volume=0" \
output.wav
```

效果：

```text
310s ───────── 315s
      静音
```

与 `atrim + concat` 的区别：

| 方法 | 总时长 | 处理效果 |
| --- | ---: | --- |
| `atrim + concat` | 缩短 | 真正删除片段 |
| `volume=0` | 不变 | 保留时间轴，仅静音 |

---

## 10. 查看音频响度 / 峰值信息

```shell
ffmpeg -i ".\7-10.5_amplified.wav" \
-af volumedetect \
-f null NUL
```

Linux：

```shell
ffmpeg -i "./7-10.5_amplified.wav" \
-af volumedetect \
-f null /dev/null
```

可用于观察：

- `mean_volume`
- `max_volume`

等信息。

> `volumedetect` 更适合查看峰值 / 平均音量，不等同于 EBU R128 的 LUFS 响度测量。

---

## 11. 批量提取并标准化 MKV 音频

PowerShell：

```powershell
Get-ChildItem *.mkv | ForEach-Object {
    $outName = $_.BaseName + "_ready.wav"

    ffmpeg -i $_.FullName `
        -vn `
        -af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" `
        -ac 1 `
        -c:a pcm_s24le `
        $outName
}
```

输出：

```text
A.mkv → A_ready.wav
B.mkv → B_ready.wav
C.mkv → C_ready.wav
```

---

# 四、图片处理

## 1. 视频截图

每秒提取一张：

```shell
ffmpeg -i input.mp4 \
-vf "fps=1" \
image_%03d.jpg
```

---

## 2. NVIDIA GPU 加速截图

```cmd
ffmpeg -hwaccel cuda \
-ss 00:00:30 -to 00:00:40 \
-i input.mp4 \
-vf fps=1 \
output/frame_%04d.jpg
```

参数：

| 参数 | 说明 |
| --- | --- |
| `-hwaccel cuda` | 使用 NVIDIA GPU 硬件加速解码 |
| `-i input.mp4` | 输入视频 |
| `-vf fps=1` | 每秒提取一帧 |
| `output/frame_%04d.jpg` | 输出文件名 |

> 是否真正获得明显加速，取决于输入编码、GPU、解码器以及后续滤镜是否成为瓶颈。

---

## 3. AV1 转 H.264 后截图

如果输入 AV1 在当前环境下解码存在兼容性或性能问题，可以先转 H.264。

### 使用 libdav1d 解码 + NVENC 编码

```cmd
ffmpeg -c:v libdav1d \
-i video.mp4 \
-c:v h264_nvenc \
-preset fast \
output_h264.mp4
```

然后：

```cmd
ffmpeg -hwaccel cuda \
-ss 00:00:30 -to 00:00:40 \
-i output_h264.mp4 \
-vf fps=1 \
output/frame_%04d.jpg
```

### 使用 libaom-av1

如果特定 AV1 文件使用 `libdav1d` 出现问题，也可以尝试：

```cmd
ffmpeg -c:v libaom-av1 \
-i video.mp4 \
-c:v h264_nvenc \
-preset fast \
output_h264.mp4
```

> 对 `h264_nvenc`，质量控制通常使用 `-cq` / `-qp` 等 NVENC 参数；不要直接把 x264 的 `-crf` 概念照搬过去。

---

## 4. 图片格式转换

例如 JFIF → PNG：

```shell
ffmpeg -i input.jfif output.png
```

FFmpeg 会根据输出文件扩展名自动选择输出格式。

---

## 5. 修改图片尺寸

```shell
ffmpeg -i input.jfif \
-vf "scale=800:600" \
output.png
```

保持比例：

```shell
ffmpeg -i input.jfif \
-vf "scale=800:-1" \
output.png
```

---

## 6. PNG 压缩

PNG 本身是无损格式，可以通过压缩等级控制：

```shell
ffmpeg -i input.jfif \
-compression_level 9 \
output.png
```

范围：

```text
0 = 更快
9 = 压缩更强
```

> 压缩等级主要影响编码速度和文件大小，不会像 JPEG 质量参数那样改变图像的有损质量。

---

## 7. 裁剪图片

```shell
ffmpeg -i input.png \
-vf "crop=width:height:x:y" \
output.png
```

例如从左上角裁剪 `300×300`：

```shell
ffmpeg -i input.png \
-vf "crop=300:300:0:0" \
output.png
```

---

## 8. 添加水印 / 叠加图层

```shell
ffmpeg -i input.png -i logo.png \
-filter_complex "overlay=10:10" \
output.png
```

将 `logo.png` 放在左上角：

```text
x = 10
y = 10
```

右下角：

```shell
-filter_complex "overlay=W-w-10:H-h-10"
```

---

## 9. 转换为带 Alpha 的 PNG

```shell
ffmpeg -i input.jpg \
-vf "format=rgba" \
output.png
```

如果输入本身没有透明信息：

> `rgba` 只会增加 Alpha 通道，新增的 Alpha 通常为完全不透明；它**不会自动抠图**。

---

## 10. 修改像素格式

```shell
ffmpeg -i input.png \
-pix_fmt rgb24 \
output.png
```

常见格式：

| Pixel Format | 含义 |
| --- | --- |
| `gray` | 灰度 |
| `rgb24` | RGB 24-bit |
| `rgba` | RGB + Alpha |
| `pal8` | 8-bit 索引色 |

---

## 11. JPG / JPEG 质量参数

### `-q:v`

通常可以使用：

```shell
ffmpeg -i input.png \
-q:v 2 \
output.jpg
```

一般来说：

```text
数值越小 → 质量越高 → 文件越大
```

常见经验：

| `-q:v` | 用途 |
| ---: | --- |
| 2～5 | 高质量 |
| 6～10 | 质量 / 体积平衡 |
| 更高 | 更强压缩 |

### JPEG 像素格式

常见：

- `yuvj444p`：4:4:4
- `yuvj422p`：4:2:2
- `yuvj420p`：4:2:0

例如：

```shell
ffmpeg -i input.png \
-pix_fmt yuvj444p \
-q:v 2 \
output.jpg
```

> 实际输出是否接受指定的 JPEG pixel format，还取决于 FFmpeg 构建和编码器支持。

---

## 12. WebP

### 无损 WebP

```shell
ffmpeg -i input.png \
-lossless 1 \
output.webp
```

### 有损 WebP

```shell
ffmpeg -i input.jpg \
-q:v 80 \
output.webp
```

### 压缩等级

```shell
ffmpeg -i input.png \
-compression_level 6 \
output.webp
```

范围：

```text
0 → 编码更快
6 → 压缩更强
```

WebP 的特点：

- 支持有损压缩
- 支持无损压缩
- 支持 Alpha
- 通常比 PNG 更适合网络传输

---

## 13. AVIF

例如使用 SVT-AV1：

```shell
ffmpeg -i input.jpg \
-c:v libsvtav1 \
-crf 20 \
output.avif
```

常见相关参数：

- `-crf`：质量控制
- `-tile-columns`
- `-tile-rows`

AVIF 基于 AV1，通常具有较高的压缩效率。

---

## 14. TIFF

TIFF 是灵活的专业图像格式，可以保存较高位深和多种像素格式。

例如：

```shell
ffmpeg -i input.png \
-compression_algo lzw \
output.tif
```

也可以：

```shell
ffmpeg -i input.png \
-pix_fmt rgb48 \
output.tif
```

常见无损压缩方式：

- `lzw`
- `deflate`
- `rle`
- `none`

---

## 15. BMP

BMP 通常使用无损 / 少压缩的位图存储方式。

例如：

```shell
ffmpeg -i input.jpg \
-pix_fmt bgra \
output.bmp
```

优点：

- 简单
- 兼容性高
- 编解码速度快

缺点：

- 文件体积通常非常大

---

# 五、字幕与封面

## 1. MP4 烧录 ASS 硬字幕 + 添加封面

### 方法一：一次完成

输入：

```text
input.mp4
cover.jpg
subtitle.ass
```

命令：

```shell
ffmpeg -i input.mp4 \
-i cover.jpg \
-filter_complex "[0:v]ass=subtitle.ass[v]" \
-map "[v]" \
-map 0:a \
-map 1:v \
-c:v:0 libx264 \
-crf 18 \
-preset slow \
-pix_fmt yuv420p \
-c:a copy \
-c:v:1 mjpeg \
-disposition:v:1 attached_pic \
output.mp4
```

核心逻辑：

```text
input.mp4
   │
   ├── Video ──→ ASS 滤镜 ──→ H.264 ──→ 主视频
   │
   └── Audio ─────────────────────────→ 直接复制

cover.jpg ──→ MJPEG ──→ attached_pic
```

### 参数说明

| 参数 | 作用 |
| --- | --- |
| `-filter_complex` | 构建复杂滤镜 |
| `ass=subtitle.ass` | 烧录 ASS 字幕 |
| `-map "[v]"` | 使用处理后的主视频 |
| `-map 0:a` | 使用原视频音频 |
| `-map 1:v` | 添加封面图片 |
| `-c:a copy` | 音频不重新编码 |
| `-c:v:1 mjpeg` | 将第二个视频流编码为 MJPEG |
| `-disposition:v:1 attached_pic` | 将第二个视频流标记为封面 |

> **硬字幕会改变视频画面，因此视频必须重新编码。**  
> 音频可以继续 `-c:a copy`。

---

## 2. 尽量保持原视频码率

例如原视频约：

```text
3840×2160
25 fps
约 6200 kb/s
H.264
```

可以：

```shell
ffmpeg -i ".\花冷列车_Toki.mp4" \
-i ".\Toki_Avatar.png" \
-filter_complex "[0:v]ass=花冷列车_Toki.ass:shaping=complex[vid]" \
-map "[vid]" \
-map 0:a \
-map 1:v \
-c:v:0 libx264 \
-b:v 6200k \
-maxrate 7000k \
-bufsize 12400k \
-pix_fmt yuv420p \
-preset slow \
-c:a copy \
-c:v:1 mjpeg \
-disposition:v:1 attached_pic \
".\花冷列车_Toki_final.mp4"
```

### 码率参数

```text
-b:v     目标平均码率
-maxrate 最大码率
-bufsize VBV 缓冲区
```

> 如果目标是“尽可能接近原文件码率”，码率控制比直接使用一个固定 CRF 更容易预测输出体积，但最终画质仍然取决于内容和编码器设置。

---

## 3. MKV 添加软字幕和封面

MKV 对多流封装非常灵活，可以把视频、音频、软字幕和封面一起封装。

```shell
ffmpeg -i input.mkv \
-i cover.jpg \
-i subtitle.ass \
-map 0:v \
-map 0:a \
-map 1:v \
-map 2:s \
-c copy \
-c:v:1 mjpeg \
-disposition:v:1 attached_pic \
output.mkv
```

流结构：

```text
output.mkv
├── Video        ← 原视频
├── Audio        ← 原音频
├── Cover        ← MJPEG
└── Subtitle     ← ASS
```

由于使用：

```text
-c copy
```

因此不需要重新编码原视频和音频。

> 与硬字幕不同，这里的 ASS 是**软字幕**，播放器需要支持字幕渲染。

---

## 4. MP4 无损替换音频

例如：

```text
video.mp4
audio.flac
```

把视频中的原音频替换为 FLAC：

```shell
ffmpeg -i video.mp4 \
-i audio.flac \
-map 0:v:0 \
-map 1:a:0 \
-c:v copy \
-c:a copy \
-shortest \
output.mp4
```

核心：

```text
视频 → 原样复制
音频 → 新音频直接复制
```

> “无损”指这里没有重新编码音视频流。最终封装格式仍必须支持你放进去的音频编码。

---

## 5. 重新编码封面尺寸

例如把封面缩放到宽度 `1500`：

### Windows CMD

```cmd
ffmpeg -i 花冷列车_Toki.mp4 -i Toki_Avatar.png ^
-filter:v:1 "scale=1500:-1" ^
-map 0:v -map 0:a -map 1:v ^
-c:v copy -c:a copy ^
-c:v:1 mjpeg ^
-disposition:v:1 attached_pic ^
cover_1500.mp4
```

这里：

```text
scale=1500:-1
```

表示：

- 宽度固定为 1500
- 高度自动按比例计算

---

## 6. MP4 无损添加 MJPEG 封面

例如：

```cmd
ffmpeg -i ".\[ANi] 無職轉生～到了異世界就拿出真本事～第三季 - 09 [1080P][Baha][WEB-DL][AAC AVC][CHT]_cut.mp4" ^
-i ".\8c9da275d6ce8224c08ae330bfd88b04.png" ^
-map 0 -map 1 ^
-c copy ^
-c:v:1 mjpeg ^
-disposition:v:1 attached_pic ^
".\[ANi] 無職轉生～到了異世界就拿出真本事～第三季 - 09 [1080P][Baha][WEB-DL][AAC AVC][CHT]_cut_covered.mp4"
```

关键参数：

```shell
-c copy
```

复制原有流。

```shell
-c:v:1 mjpeg
```

将第二个视频流（封面）编码为 MJPEG。

```shell
-disposition:v:1 attached_pic
```

将第二个视频流标记为：

```text
attached picture
```

---

# 六、图片 + 音频制作视频

例如：

```text
cover.jpg
audio.m4a
```

生成一个静态画面视频：

```shell
ffmpeg -loop 1 \
-i cover.jpg \
-i audio.m4a \
-c:v libx264 \
-preset slow \
-crf 18 \
-r 24 \
-pix_fmt yuv420p \
-c:a copy \
-shortest \
output.mp4
```

核心：

```text
图片 ──→ 循环产生视频帧
音频 ──→ 原样复制
          ↓
       MP4 视频
```

`-shortest` 很重要：

> 让输出在最短输入流结束时结束，否则循环图片可能导致视频无限生成。

---

# 七、GIF 制作

## 1. 基础方法

```shell
ffmpeg -ss 00:00:10 -to 00:00:15 \
-i input.mp4 \
-vf "fps=10,scale=320:-1" \
output.gif
```

常用参数：

| 参数 | 作用 |
| --- | --- |
| `-ss` | 起始时间 |
| `-to` | 结束时间 |
| `fps=10` | GIF 每秒 10 帧 |
| `scale=320:-1` | 宽度 320，高度按比例 |
| `output.gif` | GIF 输出 |

GIF 的文件大小主要受到：

```text
帧率
分辨率
持续时间
颜色数量
```

影响。

---

## 2. 高质量 GIF：Palette 两步法

GIF 最大的问题之一是：

```text
最多 256 色
```

因此推荐先生成调色板。

### STEP 1：生成调色板

```shell
ffmpeg -ss 00:00:10 -to 00:00:15 \
-i input.mp4 \
-vf "fps=10,scale=320:-1:flags=lanczos,palettegen" \
palette.png
```

### STEP 2：使用调色板

```shell
ffmpeg -ss 00:00:10 -to 00:00:15 \
-i input.mp4 \
-i palette.png \
-filter_complex \
"[0:v]fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse" \
output.gif
```

其中：

```text
palettegen
```

负责分析画面并生成更适合这段视频的 256 色调色板。

```text
paletteuse
```

负责使用该调色板生成 GIF。

### GIF 循环

GIF 默认通常会循环播放。

如果需要指定循环次数，可以使用：

```shell
-loop
```

---

## 3. `-ss` 的位置

### `-ss` 放在 `-i` 前

```shell
ffmpeg -ss 10 -i input.mp4 ...
```

优点：

- 更快
- 适合快速定位

缺点：

- 对部分压缩视频，定位可能受关键帧影响

### `-ss` 放在 `-i` 后

```shell
ffmpeg -i input.mp4 -ss 10 ...
```

优点：

- 更容易得到精确切点

缺点：

- 需要更多解码工作

---

# 八、纯音频生成黑场视频

例如将：

```text
your_audio.mp3
```

制作成：

```text
640×480
30 fps
黑色画面
```

```shell
ffmpeg -i your_audio.mp3 \
-f lavfi \
-i "color=c=black:s=640x480:r=30" \
-c:v libx264 \
-pix_fmt yuv420p \
-c:a copy \
-shortest \
output_black_video.mp4
```

### 关键参数

| 参数 | 作用 |
| --- | --- |
| `-f lavfi` | 使用 FFmpeg 的虚拟滤镜输入 |
| `color=c=black` | 生成黑色画面 |
| `s=640x480` | 视频分辨率 |
| `r=30` | 视频帧率 |
| `-c:v libx264` | H.264 编码 |
| `-pix_fmt yuv420p` | 提高兼容性 |
| `-c:a copy` | 音频直接复制 |
| `-shortest` | 音频结束时停止生成 |

例如 1920×1080 / 30 fps：

```shell
-f lavfi -i "color=c=black:s=1920x1080:r=30"
```

---

# 九、其它常用参数

## 1. 多线程

FFmpeg 很多编码器和滤镜会自动利用多线程。

也可以手动指定：

```shell
ffmpeg -i input.mp4 \
-threads 8 \
-c:v libx264 \
-preset fast \
output.mp4
```

常见：

```text
-threads 8
-threads 16
```

也可以使用：

```text
-threads 0
```

让 FFmpeg 自动选择。

> 不要认为 `-threads` 越大越快。实际速度还受编码器、滤镜、磁盘和 CPU 架构影响。

---

## 2. `-preset`

主要用于控制编码速度与压缩效率。

以 x264 为例：

```text
ultrafast
superfast
veryfast
faster
fast
medium
slow
slower
veryslow
placebo
```

通常：

```text
更快 → 编码速度更快，压缩效率较低
更慢 → 编码速度更慢，压缩效率更高
```

例如：

```shell
-c:v libx264 -preset slow
```

---

## 3. `-c copy`

这是 FFmpeg 中非常重要的参数：

```shell
-c copy
```

表示：

> 不进行重新编码，直接复制输入流。

因此：

```text
速度快
CPU 占用低
不会因为重新编码产生画质损失
```

但如果进行了：

```text
scale
crop
ass
drawtext
overlay
```

等视频滤镜，视频已经发生改变，就必须重新编码视频。

---

## 4. `-map`

当一个文件中存在多个流时，`-map` 用于明确指定要输出哪些流。

例如：

```shell
-map 0:v
-map 0:a
-map 1:v
```

含义：

```text
输入 0 的视频
输入 0 的音频
输入 1 的视频
```

也可以指定具体流：

```shell
-map 0:v:0
-map 0:a:1
```

---

# 十、本地帮助

查看简略帮助：

```shell
ffmpeg -h
```

查看滤镜：

```shell
ffmpeg -filters
```

查看编解码器：

```shell
ffmpeg -codecs
```

查看像素格式：

```shell
ffmpeg -pix_fmts
```

查看封装格式：

```shell
ffmpeg -formats
```

查看编码器：

```shell
ffmpeg -encoders
```

查看解码器：

```shell
ffmpeg -decoders
```

查看具体滤镜帮助：

```shell
ffmpeg -h filter=crop
```

例如：

```shell
ffmpeg -h filter=loudnorm
```

---

# 十一、Windows 批处理

## 1. 批量 JFIF → PNG

### `.bat` 文件

```bat
for %%f in (*.jfif) do ffmpeg -i "%%f" "%%~nf.png"
```

### 直接在 CMD 中执行

```cmd
for %f in (*.jfif) do ffmpeg -i "%f" "%~nf.png"
```

区别：

```text
.bat / .cmd → %%f
直接 CMD    → %f
```

---

# 十二、常用工作流速查

这一部分用于实际使用时快速复制。

---

## 🎵 A. MKV → 24-bit / 48 kHz WAV

### 单声道

```shell
ffmpeg -i input.mkv \
-vn -ac 1 -ar 48000 \
-c:a pcm_s24le \
output.wav
```

### 立体声

```shell
ffmpeg -i input.mkv \
-vn -ac 2 -ar 48000 \
-c:a pcm_s24le \
output.wav
```

---

## 🎵 B. MKV → 32-bit Float / 48 kHz WAV

```shell
ffmpeg -i input.mkv \
-vn -ac 2 -ar 48000 \
-c:a pcm_f32le \
output.wav
```

---

## 🎚 C. 提取 → 响度标准化 → 24-bit WAV

```shell
ffmpeg -i input.mkv \
-vn \
-af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" \
-ac 1 \
-c:a pcm_s24le \
output_final.wav
```

---

## ✂️ D. 删除音频中的一段干扰

例如删除：

```text
05:10 ～ 05:15
```

```shell
ffmpeg -i main.wav \
-filter_complex \
"[0:a]atrim=end=310[a1];[0:a]atrim=start=315[a2];[a1][a2]concat=n=2:v=0:a=1" \
output.wav
```

---

## 🔇 E. 不改变时长，只静音干扰

```shell
ffmpeg -i main.wav \
-af "volume=enable='between(t,310,315)':volume=0" \
output.wav
```

---

## 🎞 F. 自动检测视频黑边

```shell
ffmpeg -i input.mkv \
-vf cropdetect \
-f null -
```

然后：

```shell
ffmpeg -i input.mkv \
-vf "crop=608:1080:656:0" \
-c:a copy \
output.mkv
```

---

## 📱 G. 裁成 9:16 竖屏

```shell
ffmpeg -i input.mkv \
-vf "crop=ih*9/16:ih" \
-c:a copy \
output.mkv
```

---

## 📝 H. MP4 烧录 ASS + 添加封面

```shell
ffmpeg -i input.mp4 \
-i cover.jpg \
-filter_complex "[0:v]ass=subtitle.ass[v]" \
-map "[v]" \
-map 0:a \
-map 1:v \
-c:v:0 libx264 \
-preset slow \
-crf 18 \
-pix_fmt yuv420p \
-c:a copy \
-c:v:1 mjpeg \
-disposition:v:1 attached_pic \
output.mp4
```

---

## 💿 I. MP4 无损替换音频

```shell
ffmpeg -i video.mp4 \
-i audio.flac \
-map 0:v:0 \
-map 1:a:0 \
-c:v copy \
-c:a copy \
-shortest \
output.mp4
```

---

## 🖼 J. 图片 + 音频 → MP4

```shell
ffmpeg -loop 1 \
-i cover.jpg \
-i audio.m4a \
-c:v libx264 \
-preset slow \
-crf 18 \
-r 24 \
-pix_fmt yuv420p \
-c:a copy \
-shortest \
output.mp4
```

---

## 🎬 K. 视频片段 → 高质量 GIF

### 生成调色板

```shell
ffmpeg -ss 00:00:10 -to 00:00:15 \
-i input.mp4 \
-vf "fps=10,scale=320:-1:flags=lanczos,palettegen" \
palette.png
```

### 生成 GIF

```shell
ffmpeg -ss 00:00:10 -to 00:00:15 \
-i input.mp4 \
-i palette.png \
-filter_complex \
"[0:v]fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse" \
output.gif
```

---

# 🧭 个人使用建议

以后继续往这份笔记追加命令时，可以统一按照下面的结构：

```markdown
## N. 功能名称

### 最常用命令

```shell
ffmpeg ...
```

### 参数说明

| 参数 | 作用 |
|---|---|
| `...` | ... |

### 注意事项

> ...

### Windows / PowerShell 版本

```powershell
...
```

```
把这份文档逐渐变成自己的 **FFmpeg Cookbook / Cheat Sheet**，而不是单纯的命令堆积。
```
