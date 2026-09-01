---
title: Useful FFmpeg commands
published: 2025-09-02
description: "Was it a cat i saw!?"
category: FFmpeg 
tags: ["FFmpeg", "ffmpeg", "video", "audio", "tools"]
author: Akeboshi Himari
draft: false
--- 

## FFmpeg 是音、视频处理的一个强大开源工具，它包含许多组件和扩展库，在视频网站和商业软件被大量应用。它还有一个命令行工具，在很多场景下直接使用FFmpeg命令行工具比桌面视频处理软件更简洁高效

使用 `ffmpeg` 前，可先简单了解下视频处理的一些基本概念：

**封装(Container)格式**：也可翻译为容器，里面包括了视频、音频、字幕等内容。对视频来说，封装格式是mp4、avi、mkv等格式。

**流(Stream)**：stream是指媒体文件中的一个单独的数据通道。一个媒体文件可以包含多个流，如视频、音频、字幕等。ffmpeg本质上是操作和处理这些媒体流，比如提取、分离、合并、转码等。你可以选择特定的流进行处理，或者将多个流合并成一个新的媒体文件。

**帧(Frame)**：帧代表最小数据单元，也是编解码器真正处理的最小处理单元。对于视频来说，帧(Frame)是编码器编码后的一个图像；对于音频来说，帧(Frame)是编码器编码后的一个声音。帧分为：I帧:关键帧、P帧:预测帧、B帧:双向预测帧。编解码(Codec)：编码是指对图像和声音的打包或压缩方法；解码就是把编码后的东西还原为原来的状态。编码格式：视频和音频都需要经过编码，才能保存成文件。不同的编码格式，有不同的压缩率，会导致文件大小和清晰度的差异。常用的编码格式有H.264、H.265等。

# 🎞 视频处理

## 1.转码为MP4

~~~shell
ffmpeg -i input.mov -vcodec libx264 -acodec aac output.mp4
~~~

也可以添加额外参数

~~~shell
ffmpeg -i input.mov -c:v libx264 -c:a aac -preset medium -crf 23 output.mp4
~~~

- `-c:v`和`-c:a`分别是`-vcodec`和`-acodec`的alias
- `libx264`：转换为H.264（兼容性最好）
- `aac`：音频转为AAC（兼容广泛）
- `-crf 23`：保持较好画质，文件不会太大
- `-preset medium`：转码速度与压缩比的平衡

## 2.裁剪视频(不重新编码)

~~~shell
ffmpeg -ss 00:00:10 -i input.mp4 -t 00:00:20 -c copy output.mp4
~~~

`-ss`是起始时间，`-t`是持续时间，`-c copy`表示不改变音频和视频的编码格式，直接拷贝

## 3.修改分辨率

~~~shell
ffmpeg -i input.mp4 -vf scale=1280:720 output_720p.mp4
~~~

## 4.提取指定时间段的视频(并重新编码)

~~~shell
ffmpeg -ss 00:01:00 -to 00:02:00 -i input.mp4 -c:v libx264 -c:a aac output.mp4
~~~

## 5.加快或减慢播放速度

- 快两倍：

~~~shell
ffmpeg -i input.mp4 -vf "setpts=0.5*PTS" output_fast.mp4
~~~

~~~shell
- 慢0.5倍：
ffmpeg -i input.mp4 -vf "setpts=2.0*PTS" output_slow.mp4
~~~

# 🔊 音频处理

## 1.提取音频

~~~shell
ffmpeg -i input.mp4 -vn -acodec copy output.aac
~~~

- `vn`: 不处理视频流（只提取音频）
- `c:a aac`: 指定音频编码为 AAC（与 .aac 容器兼容）

## 2.转换为MP3

~~~shell
ffmpeg -i input.aac output.mp3
~~~

## 3.调整音量(放大一倍)

~~~shell
ffmpeg -i input.mp3 -filter:a "volume=2.0" output.mp3
~~~

## 4.混合多个音轨

~~~shell
ffmpeg -i audio1.mp3 -i audio2.mp3 -filter_complex amix=inputs=2:duration=longest output.mp3
~~~

# 🖼 图片处理

## 1.从视频中导出每秒一张图片

~~~shell
ffmpeg -i input.mp4 -vf fps=1 image_%03d.jpg
~~~

## 2.将图片序列合成为视频

~~~shell
ffmpeg -framerate 24 -i image_%03d.jpg -c:v libx264 -pix_fmt yuv420p output.mp4
~~~

## 3.提取视频的第一帧为封面图

~~~shell
ffmpeg -i input.mp4 -vf "select=eq(n\,0) -q:v 3 output.jpg"
~~~

## extra. FFmpeg 在指定时间区间内按帧提取截图

~~~cmd
ffmpeg -ss 00:00:05 -to 00:00:10 -i input.mp4 -vsync 0 -q:v 2 frame_%04d.png
~~~

## extra1. FFmpeg 指定NVIDIA GPU时间区间内按帧提取截图

~~~cmd
ffmpeg -hwaccel cuda -ss 00:00:30 -to 00:00:40 -i input.mp4 -vf fps=1 output/frame_%04d.jpg
~~~

### 📌 参数说明

| 参数                      | 说明                            |
| ----------------------- | ----------------------------- |
| `-hwaccel cuda`         | 使用 NVIDIA GPU 加速视频解码（通过 CUDA） |
| `-i input.mp4`          | 输入视频                          |
| `-vf fps=1`             | 每秒截一帧                         |
| `output/frame_%04d.jpg` | 输出图像路径                        |

## extra2. av1转码为 H.264，再截图（兼容 + 可加速）

~~~cmd
ffmpeg -c:v libdav1d -i video.mp4 -c:v h264_nvenc -crf 23 -preset fast output_h264.mp4
~~~

然后截图：

~~~cmd
ffmpeg -hwaccel cuda -ss 00:00:30 -to 00:00:40 -i output_h264.mp4 -vf fps=1 output/frame_%04d.jpg
~~~

这样截图过程可以启用 GPU 加速（因为 H.264 你支持 NVENC/NVDEC）

✅ 可选：如果转码中出现 OBU 报错，使用 libaom-av1：

~~~cmd
ffmpeg -c:v libaom-av1 -i video.mp4 -c:v h264_nvenc -preset fast output_h264.mp4
~~~

## 4.图片格式转换

~~~shell
ffmpeg -i input.jfif output.png
~~~

- `-i input.jfif`：指定输入文件
- `output.png`：自动根据后缀选择PNG编码器

## 5.修改图片尺寸

~~~shell
ffmpeg -i input.jfif -vf scale=800:600 output.png
~~~

- `scale=宽度:高度`，可用`-1`自动按比例缩放，比如：

~~~shell
-vf scale=800:-1
~~~

## 6.调整输出图片质量(对有压缩的格式如JPEG更有用)

- 虽然 PNG 是无损格式，没压缩等级设置，但你可以用`-compression_level`控制压缩（越高体积越小，速度越慢）：

~~~shell
ffmpeg -i input.jfif -compression_level 9 output.png
~~~

范围：`0`(最快)到`9`压缩最强

## 7.裁剪图片

~~~shell
ffmpeg -i input.jfif -vf "crop=width:height:x:y" output .png
~~~

例如从左上角开始裁剪300x300区域：

~~~shell
-vf "crop=300:300:0:0"
~~~

## 8.添加水印/叠加图层

~~~shell
ffmpeg -i input.jfif -i logo.png -filter_complex "overlay=10:10" output.png
~~~

将`logo.png`叠加到输入图像的左上角(x=10,y=10)

## 9.转换为带透明背景(alpha)的PNG

如果原图没有alpha，但你希望创建带alpha通道的图(比如用于抠图后保存)：

~~~shell
ffmpeg -i input.jfif -vf "format=rgba" output.png
~~~

## 10.更改颜色格式

~~~shell
ffmpeg -i input.jfif -pix_fmt rgb24 output.png
~~~

常用像素格式:

- `gray`：灰度图
- `rgb24`：24位真彩色
- `rgba`：含透明度通道
- `pal8`：8位索引色(低色图)

# ✅ 示例：高质量转换 + 改尺寸 + 添加水印

~~~shell
ffmpeg -i input.jfif -i watermark.png -filter_complex "[0][1]overlay=W-w-10:H-h-10,scale=1024:-1" -compression_level 9 output.png
~~~

# 🔍 本地帮助手册

~~~shell
ffmpeg -h           # 简略帮助
ffmpeg -filter      # 所有滤镜
ffmpeg -codecs      # 所有编解码器
ffmpeg -pix_fmts    # 所有像素格式  
ffmpeg -formats     # 所有支持的格式
~~~

# 📌 补充说明

如果你要批量转换多个 .jfif 为 .png，也可以用批处理命令（例如在 Windows 批处理脚本中）：

~~~shell
for %%f in (*.jfif) do ffmpeg -i "%%f" "%%~nf.png"
~~~

✅ 如果你直接在命令行中运行（不是 .bat 文件），要用 %f 而不是 %%f

## 1. 图片转换选项

### PNG(Portable Network Graphics) 可选的选项

`-pix_fmt`：**控制像素格式**

这个选项决定了输出 PNG 文件的颜色深度和通道数。它直接影响文件大小和颜色精度。

- `rgba`: 这会创建一个带有 Alpha 通道（透明度）的真彩色 PNG 文件。如果你的输入图片包含透明度信息，这是最佳选择，因为它能完整保留透明度。
- `rgb24`: 这会创建一个没有 Alpha 通道的真彩色 PNG 文件。文件会比 rgba 小，因为没有透明度数据。如果你不需要透明度，这是个好选择。
- `gray`: 这会创建一个灰度 PNG 文件。文件最小，但会丢失所有颜色信息。
- `graya`: 灰度文件，但包含一个 Alpha 通道。

**示例**

如果你想将一张 JPG 图片转换为带透明度的 PNG，你可以这样做：

~~~shell
ffmpeg -i input.jpg -pix_fmt rgba output.png
~~~

**注意:** 如果输入图片没有透明度，`rgba`格式会添加一个全不透明的Alpha通道

滤镜(**`-vf`**)：**图像处理选项**

在将图片保存为PNG之前，你可以使用各种视频滤镜来处理图像

- `scale`: 调整图片大小
  - `ffmpeg -i input.jpg -vf "scale=800:600" output.png`
- `crop`: 裁剪图片
  - `ffmpeg -i input.jpg -vf "crop=500:500:100:100" output.png`
- `format`: 类似于`-pix_fmt`,但更灵活，允许你强制转换像素格式
  - `ffmpeg -i input.jpg -vf "format=rgba" output.png`

### JPEG(Joint Photographic Experts Group) 可选的选项

`-q:v`或`-qscale:v`：**控制质量(常用)**

这是最常用的选项，用于直接控制 JPG 输出的质量。其值范围通常是 *2* 到 *31*。

- `ffmpeg -i input.png -q:v 2 output.jpg`: `2`是最高质量，文件最大。
- `ffmpeg -i input.png -q:v 31 output.jpg`: `31`是最低质量，文件最小。

**建议：**

- **高质量输出**：使用 `-q:v 2` 到 `-q:v 5`，这个范围能提供极好的画质，但文件较大。
- **平衡质量与大小**：使用 `-q:v 6` 到 `-q:v 10`，这是一个很好的折衷方案。

`-pix_fmt`：**像素格式**

这个选项决定了输出JPG文件的颜色格式

- `yuvj444p`: 提供了最好的颜色质量，是最高级别的色度采样(4:4:4)。文件最大。
- `yuvj422p`: 提供了中等的颜色质量（4:2:2）。在大多数情况下画质和文件大小之间达到了很好的平衡。
- `yuvj420p`: 提供了最低的颜色质量（4:2:0）。这是最常见的格式，文件最小，适用于网络传输。

**示例：**

以最高质量的像素格式输出 JPG。

~~~shell
ffmpeg -i input.png -pix_fmt yuvj444p -q:v 2 output.jpg
~~~

`-ss`和`-t`：**从视频中提取帧**

如果你从视频中提取帧并保存为 JPG，可以使用这两个选项来指定时间范围。

- `-ss`: 指定开始时间，格式为`hh:mm:ss.sss`。
- `-t`: 指定持续时间。
- `-frame:v`: 指定要提取的帧数。

**示例：**

从 `video.mp4` 的第 **5** 秒开始，提取 **10** 帧并保存为 `frame%02d.jpg`。

~~~cmd
ffmpeg -ss 5 -i video.mp4 -t 1 -frames:v 10 frame%02d.jpg
~~~

### WebP可选的选项

WebP是一种为网络优化的新一代图片格式，支持有损和无损压缩，以及透明度。

- `lossless 1`: 启用无损压缩模式。WebP的无损压缩通常比**PNG**更高效，文件更小。
  - `ffmpeg -i input.png -lossless 1 output.webp`
- ``-q:v`` 或 `-qscale:v`: 控制有损压缩的质量。值范围是 **0** 到 **100**，**100 是最高质量**。这与 JPEG 的质量选项类似，但范围相反。
  - `ffmpeg -i input.jpg -q:v 80 output.webp`
- `-compression_level`: 控制压缩速度与文件大小的平衡。值范围是 0 到 6，**6 是最慢、压缩率最高**。
  - `ffmpeg -i input.png -compression_level 6 output.webp`

WebP 格式的***独特之处***在于它能在一个文件中同时处理有损和无损压缩，并且透明度支持比 **JPEG** 更好。

### AVIF可选的选项

AVIF 是一种基于 AV1 视频编码的图片格式，旨在提供比 JPEG 和 WebP 更高的压缩效率。

- `-crf`: 控制压缩质量。与 H.264 编码器类似，值越低，质量越高，文件越大。
  - `ffmpeg -i input.jpg -c:v libsvtav1 -crf 20 output.avif`
- `-tile-columns` 和 `-tile-rows`: 决定图像如何被分割成瓦片进行并行编码，可以提高编码速度。

### TIFF可选的选项

TIFF是一种灵活且兼容性强的无损(lossless)格式，常用于印刷和专业图像编辑。

- `-compression_algo`: 控制压缩算法。TIFF 支持多种无损压缩算法，如 LZW、Deflate 和 RLE。
  - `lzw`: 常用，无损压缩。
  - `deflate`: 常用，通常比 LZW 效率更高。
  - `none`: 无压缩，文件最大。
  - `rle`: 适用于包含大片相同颜色的图像（如黑白图像）。
  - `ffmpeg -i input.png -compression_algo lzw output.tif`
- `-pix_fmt`: 支持广泛的像素格式，包括 48-bit RGB、浮点数等，这使得它在专业领域非常有用。
  - `ffmpeg -i input.png -pix_fmt rgb48 output.tif`

### BMP可选的选项

BMP 是一种无压缩的位图格式，主要用于 Windows 系统，文件体积通常很大。

- `pix_fmt`: BMP 支持多种像素格式，但通常没有压缩选项。
  - `ffmpeg -i input.jpg -pix_fmt bgra bmp_with_alpha.bmp`

BMP 格式的独特之处在于它几乎没有压缩，因此转换速度快，但文件巨大。

# 💨其它补充

### 🚀 1. 启用多线程（自动或手动指定）

FFmpeg 默认会根据系统核心数自动使用多线程，但你也可以手动指定：

~~~shell
ffmpeg -i input.mp4 -threads 8 -c:v libx264 -preset fast output.mp4
~~~

参数说明：

- `-threads 8`：手动指定使用 8 个线程（可设为 auto）
- `libx264` 本身是支持多线程的（默认会启用）
- 一些滤镜（如 scale, hqdn3d）也会自动启用多线程

📌 注意：某些滤镜不支持多线程，比如 drawtext，即使你开了 -threads 也可能没明显效果。

### 🧠 2. 使用转码预设：`-preset`

用于 libx264 和 libx265 编码器，会影响速度和压缩比：

~~~shell
-preset ultrafast
-preset superfast
-preset veryfast
-preset fast
-preset medium     # 默认值
-preset slow
~~~

越“fast”，编码越快，但文件体积越大、画质压缩越弱

### 😎 3. FFmpeg纯音频合成黑场视频

~~~shell
ffmpeg -i your_audio.mp3 -f lavfi -i color=c=black:s=640x480:r=30 -c:v libx264 -pix_fmt yuv420p -c:a copy -shortest output_black_video.mp4
~~~

- `-i your_audio.mp3`: 指定你的输入音频文件。替换 `your_audio.mp3` 为你的实际音频文件路径。
- `-f lavfi`:　告诉 FFmpeg 使用 `lavfi` (libavfilter input) 虚拟设备。
- `-i color=...`: 这是 `lavfi`的一个源滤镜，用于生成一个纯色视频流。
`c=black`: 设置颜色为黑色。你也可以使用其他颜色名称（如 white, red）或十六进制 RGB 值（如 c=0x000000）。
`s=1920x1080`: 设置视频分辨率为 1920x1080 (Full HD)。你可以根据需要更改这个值，例如 1280x720 (HD)。
`r=30`: 设置视频帧率为 30 fps。你也可以设置为其他帧率，例如 r=25 或 r=60。
`-c:v libx264`: 指定视频编码器为 libx264，这是最常用的 H.264 编码器。
`-pix_fmt yuv420p`: 指定像素格式为 yuv420p。这是 H.264 的标准像素格式，具有广泛的兼容性。
`-c:a copy`: 复制音频流，不重新编码。这样可以保持原始音频的音质和编码格式（例如，如果你的输入是 AAC，输出的 MP4 中音频也会是 AAC）。
`-shortest`: 这个非常重要！它告诉 FFmpeg 输出的视频时长应与最短的输入流（在这里就是你的音频文件）的持续时间保持一致。如果没有这个，FFmpeg 会生成一个无限长的黑屏视频。
`output_black_video.mp4`: 指定输出的 MP4 文件名。

### ✨ 4. 使用FFmpeg提取指定视频时间区域制作成GIF

**基本命令(质量较低)**

~~~shell
ffmpeg -ss [开始时间] -to [结束时间] -i input.mp4 -vf "fps=10,scale=320:-1" output.git
~~~

- `ss [开始时间]`: 指定视频的开始时间。格式可以是`HH:MM:SS`(小时:分钟:秒)或(SS)秒。例如：`00:00:10` 表示从视频的第 10 秒开始，``5`` 表示从视频的第 5 秒开始。
- `to [结束时间]`：指定视频的结束时间。格式与` -ss `相同。
- `i input.mp4`：指定输入视频文件。请将` input.mp4 `替换为你的视频文件路径。
- `-vf "fps=10,scale=320:-1"`是视频滤镜选项：
  - `fps=10`：设置 GIF 的帧率（每秒帧数）为 10。较低的帧率可以减小 GIF 的文件大小。你可以根据需要调整此值。
  - `scale=320:-1`：设置 GIF 的宽度为 320 像素，高度会自动根据原始视频的宽高比进行调整（-1 表示保持宽高比）。你可以调整宽度来控制 GIF 的尺寸和文件大小。
  - `output.gif`：指定输出 GIF 文件的名称。

**高质量 GIF（两步法 - 推荐）**

1. **生成调色板 (palettegen)：** FFmpeg 会分析视频中的颜色，生成一个最优的 256 色调色板。GIF 格式限制为 256 种颜色，所以使用一个定制的调色板可以显著提高图像质量。
2. **使用调色板生成 GIF (paletteuse)：** 使用上一步生成的调色板来渲染 GIF。

**步骤 1: 生成调色板**

~~~shell
ffmpeg -ss [开始时间] -to [结束时间] -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos,palettegen" palette.png
~~~

**与基本命令相比，新增和修改的参数：**

- `flags=lanczos`：在缩放时使用 Lanczos 算法，通常能提供更好的缩放质量。
- ``palettegen``：这是一个滤镜，用于生成调色板。
- ``palette.png``：输出的调色板文件（临时文件）。
**步骤 2: 使用调色板生成 GIF**

~~~shell
ffmpeg -ss [开始时间] -to [结束时间] -i input.mp4 -i palette.png -filter_complex "fps=10,scale=320:-1:flags=lanczos[x];[x]:[1:v]paletteuse" output.gif
~~~

**新增和修改的参数：**

- `-i palette.png`：将上一步生成的调色板文件作为第二个输入。
- `-filter_complex "fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse"`：这是一个复杂的滤镜链：
  - `fps=10,scale=320:-1:flags=lanczos`：与第一步相同，对视频进行帧率和尺寸调整，并将结果命名为 [x]。
  - `[x][1:v]`：将处理后的视频流 [x] 和第二个输入（`palette.png`，即 `[1:v]` 视频流）作为输入。
  - `paletteuse`：使用调色板将视频转换为 GIF。

**额外优化和注意事项**

- **文件大小**： GIF 文件的主要影响因素是**帧率(flame)**、**分辨率(resolution)**和**持续时间(durations)**。降低帧率 (`fps`)、缩小尺寸 (`scale`) 和缩短持续时间可以显著减小文件大小。
- **循环播放**：GIF 默认是无限循环的。如果你想控制循环次数，可以在输出文件前添加`` -loop ``参数。
- **开始时间` -ss `的位置：**
- 将 `-ss` 放在 `-i` 之前：这样 FFmpeg 会在读取输入文件之前先定位到指定时间，这通常更快，但可能会导致起始时间略微不准确（它会寻找最近的关键帧）。
- 将 `-ss` 放在 `-i` 之后：这样 FFmpeg 会从视频开头开始解码，然后在指定时间点开始处理，通常更精确，但对于大型视频文件可能会比较慢。对于 GIF 提取，通常精确度更重要，所以放在 `-i` 之后可能更合适。

### 😤 5. 使用FFmpeg为MP4视频格式文件压入封面和硬字幕（重新编码）

使用 FFmpeg 为 MP4 视频添加封面和硬字幕是一个复杂但可行的操作，它涉及到多个输入文件和流映射（`map`）的正确使用。

要实现这个目标，你需要执行一个命令，该命令会同时处理以下三个流：

1. **原始视频流**（需要重新编码来烧录字幕）。
2. **原始音频流**（可以直接复制）。
3. **封面图片流**（需要作为附加图片流复制）。

**完整命令**

三个文件：

- `input.mp4`: 原始视频文件
- `cover.jpg`: 作为封面的图片
- `subtitle.ass`: 字幕文件

**方法一：使用滤镜同时添加封面和字幕**

~~~shell
ffmpeg -i input.mp4 -i cover.jpg -i subtitle.ass -filter_complex "[0:v]ass=subtitle.ass[v]" -map "[v]" -map 0:a -map 1:v -c:v libx264 -crf 18 -c:a copy -c:v:1 mjpeg -disposition:v:1 attached_pic output.mp4
~~~

- `-filter_complex "[0:v]ass=subtitle.ass[v]"`: This is the best practice for applying the `ass` filter.It explicitly takes the main video stream from the first input([0:v]), applies the `ass` filter (which automatically reads from `subtitle.ass`), and names the resulting filtered video stream `[v]`.This is much clearer and less prone to error

- `-map [v]`: We then map this newly filtered video stream (`[v]`) to the output.This ensures that only the main video with the burned-in subtitles is included.
- The other `-map` flags remain the same: `-map 0:a` for the audio and `-map 1:v` for the cover image.The `-c:v:1 mjpeg -disposition:v:1 attached_pic` part is now correctly applied to the mapped cover image stream.

**方法二：先压入字幕后压入封面**

STEP1

~~~shell
ffmpeg -i input.mp4 -vf "ass=subtitle.ass" -c:v libx264 -crf 18 -c:a copy output.mp4
~~~

- `-vf "ass=subtitle.ass"`: 这是关键的视频滤镜。ass 滤镜会读取.ass文件并将其内容绘制到视频帧上。

STEP2

~~~shell
ffmpeg -i input.mp4 -i cover.jpg -map 0:v -map 0:a -map 1:v -c:v copy -c:a copy -c:v:1 mjpeg -disposition:v:1 attached_pic output.mp4
~~~

- `-c:v:1 mjpeg -disposition:v:1 attached_pic`：这些参数只作用于**第二个视频流（v:1）**，也就是你的封面图片，将其正确处理为内嵌封面。

### 😇 6. 使用FFmpeg为MKV视频格式文件压入软字幕（不重新编码）

~~~shell
ffmpeg -i input.mkv -i cover.jpg -i subtitle.ass -map 0:v -map 0:a -map 1:v -map 2:s -c copy -disposition:v:1 attached_pic output.mkv
~~~

- `-i input.mkv`: 你的第一个输入文件。

- `-i cover.jpg`: 你的第二个输入文件，封面图片。

- `-i subtitle.ass`: 你的第三个输入文件，字幕文件。

- `-map 0:v`: 映射第一个输入文件（`input.mkv`）中的视频流。

- `-map 0:a`: 映射第一个输入文件（`input.mkv`）中的音频流。

- `-map 1:v`: 映射第二个输入文件（`cover.jpg`）中的视频流。

- `-map 2:s`: 映射第三个输入文件（`subtitle.ass`）中的字幕流。

- `-c copy`: 这是最重要的参数，它告诉 FFmpeg **直接复制所有流**，不进行任何重新编码。因为 MKV 容器支持将字幕和封面作为独立的流，所以无需进行耗时的转码。

- `-disposition:v:1 attached_pic`: 这个参数是关键，它告诉 FFmpeg 将第二个输入文件（你的封面图片）标记为“附加图片”，这样播放器就能识别并显示它作为封面。

- `output.mkv`: 最终输出的文件名。

这个命令利用了 MKV 容器的灵活性，实现了**快速、无损地**添加封面和软字幕。
