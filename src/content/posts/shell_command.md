---
title: 鸟哥Linux笔记
published: 2025-06-08
description: "Linux 是什么!?"
category: Linux
tags: ["linux", "shell", "command", "fucntion", "c"]
author: Akeboshi Himari
draft: false
--- 

# Linux文件、目录与磁盘格式

## 用户与用户组
`useradd`、`groupadd`、`chown`、`chgrp`、`chmod`、`usermod`、`userdel`、`groupdel`
### 🧑‍💻 一、useradd：添加用户
~~~cmd
sudo useradd [选项] 用户名
~~~
常用选项：
| 选项             | 说明                       |
| -------------- | ------------------------ |
| `-m`           | 自动创建用户主目录（如 `/home/用户名`） |
| `-s /bin/bash` | 指定默认 shell               |
| `-g 组名`        | 指定主组                     |
| `-G 组1,组2`     | 加入附加组                    |
示例：
~~~cmd
sudo useradd -m -s /bin/bash -g users -G wheel,developers alice
~~~
然后设置密码：
~~~cmd
sudo passwd alice
~~~
### 👥 二、groupadd：添加用户组
~~~cmd
sudo groupadd 组名
~~~
示例：
~~~cmd
sudo groupadd developers
~~~
常用选项：
| 选项             | 说明                       |
| -------------- | ------------------------ |
| `-g GID`           | 设置自定义的GID |
| `-U users` |      设置组成员         |
| `-f`        |      如果设定的GID已经存在则强制覆盖原组          |
### 📂 三、chown：更改文件/目录的属主和属组（change owner）
~~~cmd
sudo chown [选项] 用户[:组] 文件
~~~
常用选项：
| 选项   | 说明          |
| ---- | ----------- |
| `-R` | 递归更改目录下所有文件 |
示例：
~~~cmd
sudo chown alice file.txt # 改文件属主为 alice
sudo chown alice:developers file.txt # 改文件属主为 alice 属组为 developers 
sudo chown -R bob: /var/www/ # 递归更改整个目录
~~~
### 👪 四、chgrp：只更改属组（change group）
~~~cmd
sudo chgrp [选项] 组 文件
~~~
示例：
~~~
sudo chgrp developers file.txt
sudo chgrp -R staff /opt/shared # 递归更改整个目录
~~~
### 🔐 五、chmod：更改权限（change mode）
~~~cmd
chmod [选项] 模式 文件
~~~
权限符号简记：
| 符号  | 含义      |
| --- | ------- |
| `r` | 读权限（4）  |
| `w` | 写权限（2）  |
| `x` | 执行权限（1） |
模式表示法：
1. 数字表示法（常用）：
~~~cmd
chmod 755 file
# 表示：
# owner: rwx (7), group: rx (5), others: rx (5)
~~~
2. 符号表示法：
~~~cmd
chmod u+x file     # 给属主添加执行权限
chmod g-w file     # 移除属组写权限
chmod o=r file     # 设置其他用户为只读
~~~
递归修改目录：
~~~cmd
chmod -R 755 /some/dir
~~~
🎯 权限组合实例：
| 权限    | 数字        | 含义            |
| ----- | --------- | ------------- |
| `777` | rwxrwxrwx | 所有人可读写执行（不安全） |
| `755` | rwxr-xr-x | 常用于脚本或网站目录    |
| `700` | rwx------ | 仅属主可读写执行      |
| `644` | rw-r--r-- | 常用于文本配置文件     |
| `600` | rw------- | 私密文件（如密钥）     |

### 👤 六、usermod：修改用户信息
~~~cmd
usermod [选项] 用户名
~~~
常用选项：
| 选项             | 功能                   |
| -------------- | -------------------- |
| `-l 新用户名`      | 修改用户名                |
| `-d /新路径`      | 修改主目录（需配合 `-m` 移动内容） |
| `-m`           | 移动用户主目录内容到新路径        |
| `-s /bin/bash` | 修改默认 shell           |
| `-g 组名`        | 设置主组                 |
| `-G 组1,组2,...` | 设置附加组（会覆盖原有附加组）      |
| `-aG 组名`       | 追加附加组（不删除原有附加组）      |
| `-L` / `-U`    | 锁定/解锁账号（禁止/恢复登录）     |
🧪 示例：
➤ 添加用户 alice 到 `sudo` 组：
~~~cmd
sudo usermod -aG sudo alice
~~~
➤ 修改用户 shell 为 bash：
~~~cmd
sudo usermod -s /bin/bash alice
~~~
➤ 改用户名 alice 为 alina：
~~~cmd
sudo usermod -l alina alice
~~~

### ❌ 七、userdel：删除用户
~~~cmd
userdel [选项] 用户名
~~~
常用选项：
| 选项   | 功能              |
| ---- | --------------- |
| `-r` | 同时删除用户主目录、邮箱等文件 |
🧪 示例：
➤ 删除用户但保留主目录：
~~~cmd
sudo userdel alice
~~~
➤ 删除用户并清理其主目录：
~~~cmd
sudo userdel -r alice
~~~
> ⚠️ 注意：如果用户当前正在登录，userdel 会失败，需先 pkill -u alice 再删。

### 👥 八、groupdel：删除组
~~~cmd
sudo groupdel 组名
~~~
> ⚠️ 不能删除有用户主组为该组的情况，需先修改相关用户的主组。
🧪 示例：
➤ 删除 developers 组：
~~~cmd
sudo groupdel developers
~~~
**🔍 用户和组信息查看补充命令**
| 命令              | 功能                |
| --------------- | ----------------- |
| `id 用户名`        | 查看用户 UID/GID 和所属组 |
| `groups 用户名`    | 查看该用户所属所有组        |
| `getent passwd` | 列出所有用户            |
| `getent group`  | 列出所有组             |

**✅ 总结小贴士**
| 目的       | 命令示例                           |
| -------- | ------------------------------ |
| 修改用户主目录  | `usermod -d /new/home -m user` |
| 添加附加组    | `usermod -aG group user`       |
| 删除用户和主目录 | `userdel -r user`              |
| 删除无用组    | `groupdel group`               |


### 🧪 示例：设置目录权限给指定用户和组：
~~~cmd
sudo useradd -m alice # -G devs
sudo groupadd devs # -U alice
sudo usermod -aG devs alice

sudo mkdir /data/project
sudo chown alice:devs /data/project
sudo chmod 770 /data/project
~~~
此时 `/data/project`：
- 属主是 `alice`；
- 属组是 `devs`；
- 只有属主和组用户有读写执行权限，其他用户无权访问。


### 访问权限相关
- 对文件来讲，权限的功能为：
  - `r`：可读取此一文件的实际内容，如读取文本文件的文字内容等；
  - `w`：可以编辑、新增或是修改该文件的内容(但不删除该文件)；
  - `x`：该文件具有可以被系统执行的权限。
- 对目录来说，权限的功能为：
  - `r`：读取目录中的内容；
  - `w`：修改目录中的内容；
  - `x`：访问目录。

---------------
## 目录与路径
~~~cmd
.           代表此层目录。
..          代表上一层目录。
-           代表前一个工作目录。
~           代表目前使用者身份所在的家目录。
~username   代表username这个使用者的家目录
~~~


### 😎 cd - change directory
<ins>cd changes the current working directory.</ins>
~~~cmd
cd /path/to/dir
~~~

### 😋 pwd - output the current working directory
<ins>pwd outputs (prints) the current working directory</ins>

**SYNOPSIS(摘要)**

`pwd [-P | --physical]`<br>
`pwd [-L | --logical]`
~~~cmd
pwd # -p
~~~

### 🆕 mkdir - make directories
<ins> Create the DIRECTORY(ies), if they do not already exist.</ins>
~~~cmd
mkdir [options] dirName
~~~
****Common options(常见选项)：****
| 选项   | 含义                  |
| ---- | ------------------- |
| `-p` | 递归创建多级目录，不存在时自动建父目录 |
| `-m`| 设置file mode 而不是使用umask |
| `-v` | verbose: print a message for each created directory |

### ❌ rmdir - remove empty directories
<ins>Remove the DIRECTORY(ies), if they are empty.</ins>
~~~cmd
rmdir -p/-v emptyDir
~~~
**✅ 总结表：**
| 命令      | 功能     | 常见用法示例                  |
| ------- | ------ | ----------------------- |
| `cd`    | 切换目录   | `cd /etc`, `cd ..`      |
| `pwd`   | 显示当前路径 | `pwd`                   |
| `mkdir` | 创建目录   | `mkdir -p my/data/logs` |
| `rmdir` | 删除空目录  | `rmdir temp_dir`        |

### 📁 一、文件与目录操作类
**🔸ls：列出目录内容**
~~~cmd
ls [选项] [目录]
~~~
- `-l`： 详细列表
- `-a`： 显示隐藏文件
- `-h`： 人类可读的文件大小
- `-R`：递归列出子目录

例：
~~~cmd
ls -lah /etc
~~~
**🔸cp：复制文件或目录**
~~~cmd
cp [选项] 源文件 目标
~~~
- `-r`：递归复制目录
- `-i`：覆盖前询问
- `-u`：仅复制较新文件

****其他选项：****
`-a`:将原有属性复制和链接文件原带复制，
`-p`:将文件属性一起复制，不复制链接文件(和`-a`的区别)，`-l`:硬链接文件建立，`-s`:软链接文件建立

例：
~~~cmd
cp -ri ~/docs /mnt/usb/
cp -rp ~/docs /mnt/usb/
cp -a ~/docs /tmp
~~~
**🔸rm：删除文件或目录**
~~~cmd
rm [选项] 文件/目录
~~~
- `-r`：递归删除目录
- `-f`：强制删除
- `-i`：每次删除前确认

[注释]: #

例：
~~~cmd
rm -rf ~/temp/
~~~
**🔸mv：移动或重命名文件**
~~~cmd
mv [选项] 源 目标
~~~
- `-i`：覆盖时提示
- `-u`：仅移动更新文件
例：
~~~cmd
mv file.txt backup/file.txt
~~~
**🔸basename：获取路径中的文件名部分**
~~~cmd
basename 路径 [后缀]
~~~
例：
~~~cmd
basename /etc/passwd # 输出: passwd
basename /path/file.txt .txt # 输出: file
~~~
**🔸dirname：获取路径中的目录部分**
~~~cmd
dirname 路径
~~~
例：
~~~cmd
dirname /etc/passwd # 输出：/etc
~~~
**🔸touch：创建空文件或更新文件时间戳**
~~~cmd
touch [-acdmt] 文件
~~~
- `-a`：仅自定义access time；
- `-t`：后面可以接自定义的日期而不用目前的日期，格式为[YYYYMMDDhhmm];
- `-d`：接自定义日期 

例：
~~~cmd
touch test
touch -d "2 days ago" bashrc
touch -t 202506051111 bashrc
~~~
> ⚠修改的是mtime和atime

---------------
### 📖 二、查看文件内容类
**🔸cat：连接并显示文件内容**
~~~cmd
cat [-AbEnTv] files
~~~
- `-A`：相当于-vET的整合选项，可列出一些特殊字符而不是空白而已；
- `-n`：打印出行号，连同空白行也有行号，与`-b`选项不同
- `-b`：列出行号，空白行不列

例：
~~~cmd
cat file.txt
cat -n file.txt 
cat -b /etc/passwd
cat -A /etc/pacman.conf
~~~
**🔸tac：逆序显示文件内容**
~~~cmd
tac file
~~~
**🔸more：分页显示（不能向上滚动）**
> <ins>空格翻页，less同理</ins>

**🔸less：分页显示（支持上下滚动）**
> ❤ 支持向上向下翻动一行，`/`查找字符串，`n`向下查找，`?`向上查找
>> <font color="red">善用``man``和``tldr``指令</font>

**🔸head：显示前几行**
- `-n`：最常用，代表显示前几行
~~~cmd
head -n 10 /etc/pacman.conf
~~~
显示文件前十行

**🔸tail：显示末尾几行**
- `-n`：显示末尾前几行
- `-f`：跟踪文件变化
> `-f`用于
>> <p style="color:pink"><ins>日志随时写入情况</ins></p>

~~~cmd
tail -n 20 /etc/passwd
tail -f /var/log/syslog
~~~
> <font color="#E3A212"><ins>tail常和head结合使用查找一个ascii文本文件区间范围文本</ins></font>
>> **显示/etc/pacman.conf文件11到20行**
>>> `head -n 20 /etc/pacman.conf | tail -n 10`
>>>> _先显示前20行后显示后10行_ <br>

>`cat -n /etc/passwd | head -n 10 | tail -n 5`
>> _可以列出行号的截取_

**🔸od（Octal Dump）：以八进制或十六进制显示文件内容（用于二进制分析）**
~~~cmd
od [-t type] 文件
~~~
`-t`后面可以接各种类型的输出，例如：

a   ：利用默认字符来输出 <br>
c   ：使用ASCII字符来输出<br>
d [size]  ：使用十进制(decimal)来输出数据，每个整数占用size Bytes；<br>
f [size]  ：使用浮点数输出，其他同上<br>
o [size]  ：八进制<br>
x [size]  ：十六进制<br>
- 范例一：将`/usr/bin/passwd`的内容使用ASCII方式来显示。
~~~cmd
od -t c /usr/bin/passwd
~~~
- 范例二：将`/etc/issue`这个文件内容以八进制列出存储值
~~~cmd
od -t oCc /etc/issue
~~~
- 范例三：用作ascii对照表查找字符的ASCII码
~~~cmd
echo password | od -t oCc
~~~
> 其实不用带`-t`也可以
---------------

### 🔒 三、权限与属性管理
**🔸chattr：改变文件属性（适用于 ext 和部分文件系统）**
~~~cmd
chattr [+-=] [ASacdistu] 文件或目录名称
~~~
- `-i`：让一个文件「不能被删除，改名，设置链接也无法写入或新增数据」
- `-c`：设置这个属性会使文件自动被压缩，读取时解压缩

~~~cmd
chattr +i file
chattr -i file
chattr +c file
chattr -c file
~~~
**🔸lsattr：查看文件属性**
~~~cmd
lsattr [-adR] 文件或目录
~~~
> **man chattr** or *tldr lsattr*

**🔸umask：显示或设置默认权限掩码**
~~~cmd
umask / umask -S/s和-p都是显示隐藏的默认创建文件权限码
umask 022 设置创建文件时的文件权限
~~~

---------------
### 🧩 四、文件类型与状态
**🔸file：识别文件类型**
~~~cmd
file /bin/ls
~~~
**🔸stat：查看详细状态（权限、大小、时间戳）**
~~~cmd
stat filename
~~~

---------------

### 🔎 五、文件查找与定位
**🔸which：查命令路径（依赖 $PATH）**
~~~cmd
which bash
~~~
**🔸whereis：查命令、源码、man 手册位置**
~~~cmd
whereis ls
~~~
**🔸locate：快速查找文件（依赖数据库）**
~~~cmd
sudo updatedb
locate passwd
~~~
**🔸find：遍历文件系统查找文件(最常用)**
`find 路径 条件 动作`
1. **与时间有关的选项：`-atime`,`-citme`,`mtime`，以`mtime`举例**
- `-mtime n`：n为数字，意义为在n天之前的「一天之内」被修改过内容的文件；
- `-mtime +n`：列出在n天之前(不含n天本身)被修改过内容的文件；
- `-mtime -n`：列出在n天之内(含n天本身)被修改过内容的文件；
- `-newer file`：file为一个存在的文件，列出比file还要新的文件

范例一：将系统上24小时内有修改过的文件列出

`find / -mtime 0`

将三天前那一天的24小时内有修改过的文件列出

`find / -mtime 3`

范例二：寻找`/etc`下的文件，如果文件日期比`/etc/passwd`新就列出

`find /etc -newer /etc/passwd`

三天内<br>
`find / -mtime -3`

三天外<br>
`find / -mtime +3`


2. **与使用者或用户组有关的参数：`-uid n`,`-gid n`,`-user name`,`-group name`,`-nouser`,`-nogroup`**

范例三：查找/home下属于Nagisa的文件

`find /home -user Nagisa`

范例四：查找系统中不属于任何人的文件

`find / -nouser`

1. **与文件权限及名称有关的参数：`-name filename`,`-size [+-]SIZE`(查找比SIZE还要大(+)的或小(-)的文件,size规格为`c`Bytes和`k`KBytes),`-type TYPE`;`-perm -mode / /mode`;**
范例五：找出文件名为passwd的文件

`find / -name passwd`

范例六：找出包含passwd关键字的文件

`find / -name "*passwd*"`

范例七：找出在`/run`目录下，文件类型为socket的文件名有哪些？

`find /run -type s`

范例八：查找文件当中含有SGID、SUID、SBIT属性的文件
`find / -perm /7000`

> 所谓的7000就是 ``---s--s--t``,那么只要含有s或t的就列出，所以当然要使用`/7000`
>> 使用`-7000`需要同时含有这三个权限
>>> -perm 亦可用于普通权限文件查找<br>
>>  `find /usr/bin -perm 755`

常用例：
~~~cmd
find /usr/bin /usr/sbin -perm /6000 # 无SBIT权限

inshell: $(find "$WALLPAPER_DIR" -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" -o \) | shuf -n 1) 
# 随机抽取指定目录下的一张指定格式的图片

find . -type f \( -name "*.txt" -o -name "*.md" \) ! -name "README.md"
# 查找当前目录下，**文件类型是普通文件**，扩展名为.txt 或 .md 但不包括 README.md的文件

find . -type f ! -name "*.bak"
# 排除以.bak结尾的文件

find . -name "*.tmp" -delete
# 删除文件 (-delete 一定要配合 -type f 使用防止误删文件)

find . -name "*.log" -exec rm {} \; # 删除 .log 文件
find . -type f -exec chmod 644 {} \; # 批量修改权限
find . -name "*.txt" -exec wc -l {} + # +可以批量处理 统计所有txt行数

find . -name "*.log" | xargs rm
# 搭配xargs 

find . -type f -empty # 空文件
find . -type d -empty # 空目录

find . -name "*.mp3" -exec mv {} /target/dir/ \;
find . -name ".jpg" -exec cp {} /backup/ \;
# 查找并移动/复制文件

find . -maxdepth 1 -name "*.sh" # 当前目录下查找
find . -mindepth 2 # 忽略前几层目录
~~~


| 场景         | 与 (AND)   | 或 (OR) | 非 (NOT)      |    |     |
| ---------- | --------- | ------ | ------------ | -- | --- |
| Shell 命令行  | `&&`      |  `\|\|`    |    `!` |
| `find` 命令中 | `-a`（可省略） | `-o`   | `!` 或 `-not` |    |     |

4.**额外可以进行的操作：`-exec command`(command为其他命令，-exec后面再接额外命令来处理查找到的结果),`-print`(将结果打印到屏幕上，默认操作)**

范例九：将上个范例找到的文件使用ls -l列出来

`find /usr/bin /usr/sbin -perm /7000 -exec ls -l {} \;`
> `ls -l`就是额外的command，命令不支持命令别名
>> 所以只能用<ins>`ls -l`</ins>不可以使用<ins>`ll`</ins>

范例十：找出系统中大于1MB的文件

`find / -size +1M`

范例十一：找出系统中小于1KB的文件

`find / -size -1k`

✅ 总结（速查）
| 用法   | 示例                      |
| ---- | ----------------------- |
| 按名查  | `-name` / `-iname`      |
| 按类型  | `-type f` / `-type d`   |
| 按时间  | `-mtime -n` / `-newer`  |
| 按大小  | `-size +100M`           |
| 空文件  | `-empty`                |
| 权限查  | `-perm 755`             |
| 排除条件 | `! -name`               |
| 删除   | `-delete`               |
| 执行命令 | `-exec` 或配合 `xargs`     |
| 限制深度 | `-maxdepth`、`-mindepth` |
| 跳过目录 | `-prune`                |

### 💨 Extra、文件特殊权限：SUID、SGID、SBIT
~~~cmd
chmod u+s # SUID设置
chmod g+s # SGID设置
chmod +t  # SBIT设置
~~~
- <font color="#8BDB67">文件具有`SUID`的特殊权限时，代表当用户执行此二进制程序时，在执行过程中用户会暂时具有程序拥有者的权限</font>
- <font color="#39DBB5">目录具有`SGID`的特殊权限时，代表用户在这个目录下面新建的文件的用户组都会与该目录的组名相同</font>
- <font color="#82DBA8">目录具有`SBIT`的特殊权限时，代表在该目录下用户建立的文件只有自己与root能够删除</font>

---------------

## 磁盘与文件系统
> MBR: Master Boot Record<br>
> GPT: GUID Partition Table
### 一、磁盘分区 (Partitioning)

#### 1. 查看磁盘信息
* **`lsblk`**: 列出所有块设备及其分区信息，包括设备名称、大小、挂载点、文件系统类型等。这是最常用且直观的命令。
    ```bash
    lsblk
    ```
* **`fdisk -l`**: 列出所有磁盘的分区表信息。
    ```bash
    sudo fdisk -l
    ```
* **`parted -l`**: 另一个查看分区表的工具，对于 GPT 分区表支持更好。
    ```bash
    sudo parted -l
    ```

#### 2. 分区工具

* **`fdisk` (MBR 和 GPT):** 适用于传统的 MBR (Master Boot Record) 分区表，也支持 GPT (GUID Partition Table) 分区表。它是交互式的。
    ```bash
    sudo fdisk /dev/sdX  # 替换 /dev/sdX 为你的磁盘设备名，例如 /dev/sdb
    ```
    进入 `fdisk` 后，可以使用以下常用命令：
    * `m`: 显示帮助信息。
    * `p`: 打印当前磁盘的分区表。
    * `n`: 创建新分区。
    * `d`: 删除分区。
    * `w`: 将更改写入磁盘并退出。
    * `q`: 不保存更改并退出。

* **`parted` (MBR 和 GPT):** 功能更强大，尤其在处理大容量磁盘和 GPT 分区时更为灵活。可以交互式使用，也可以通过命令行直接操作。
    ```bash
    sudo parted /dev/sdX  # 替换 /dev/sdX 为你的磁盘设备名
    ```
    进入 `parted` 后，可以使用以下常用命令：
    * `print`: 打印分区表。
    * `mklabel gpt` 或 `mklabel msdos`: 创建新的分区表类型 (GPT 或 MBR)。
    * `mkpart primary ext4 0% 100%`: 创建一个主分区，文件系统类型为 ext4，从磁盘的0%到100%。你可以根据需要调整大小和文件系统类型。
    * `resizepart`: 调整分区大小。
    * `rm`: 删除分区。
    * `quit`: 退出。

---

### 二、文件系统格式化 (Formatting File Systems)

创建分区后，需要对其进行格式化以创建文件系统，才能存储数据。

* **`mkfs` 系列命令：** `mkfs` 是一个通用命令，后面可以跟不同的文件系统类型。
    * **Ext4 (Linux 常用):**
        ```bash
        sudo mkfs.ext4 /dev/sdXY  # 替换 /dev/sdXY 为你的分区名，例如 /dev/sdb1
        ```
        或者
        ```bash
        sudo mkfs -t ext4 /dev/sdXY
        ```
    * **XFS:**
        ```bash
        sudo mkfs.xfs /dev/sdXY
        ```
    * **FAT32 (兼容 Windows):**
        ```bash
        sudo mkfs.vfat /dev/sdXY  # 或者 mkfs.fat -F 32 /dev/sdXY
        ```
    * **NTFS (兼容 Windows):**
        ```bash
        sudo mkfs.ntfs /dev/sdXY
        ```
    * **Btrfs:**
        ```bash
        sudo mkfs.btrfs /dev/sdXY
        ```

---

### 三、分区分卷 (Logical Volume Management - LVM)

LVM 允许你将多个物理磁盘或分区组合成一个或多个逻辑卷，从而提供更大的灵活性，例如在线调整大小、创建快照等。

#### LVM 基本概念

* **PV (Physical Volume - 物理卷):** 物理磁盘或分区，LVM 的最基本单元。
* **VG (Volume Group - 卷组):** 一个或多个 PV 的集合。
* **LV (Logical Volume - 逻辑卷):** 在 VG 上创建的虚拟分区，可以像普通分区一样格式化和挂载。

#### LVM 常用命令

* **创建 PV:**
    ```bash
    sudo pvcreate /dev/sdXY  # 将分区标记为物理卷
    ```
* **查看 PV:**
    ```bash
    sudo pvs
    sudo pvdisplay
    ```
* **创建 VG:**
    ```bash
    sudo vgcreate my_vg /dev/sdb1 /dev/sdc1  # 创建名为 my_vg 的卷组，包含 sdb1 和 sdc1
    ```
* **查看 VG:**
    ```bash
    sudo vgs
    sudo vgdisplay
    ```
* **从 VG 中扩展/移除 PV:**
    ```bash
    sudo vgextend my_vg /dev/sdd1  # 将 sdd1 添加到 my_vg
    sudo vgreduce my_vg /dev/sdd1  # 从 my_vg 移除 sdd1 (需确保上面没有 LV)
    ```
* **创建 LV:**
    ```bash
    sudo lvcreate -L 10G -n my_lv my_vg  # 在 my_vg 中创建名为 my_lv 的 10GB 逻辑卷
    sudo lvcreate -l 100%FREE -n my_lv my_vg # 使用 VG 中所有可用空间创建 LV
    ```
* **查看 LV:**
    ```bash
    sudo lvs
    sudo lvdisplay
    ```
* **调整 LV 大小 (扩展/收缩):**
    ```bash
    sudo lvextend -L +5G /dev/my_vg/my_lv  # 将 my_lv 扩展 5GB
    sudo lvreduce -L -2G /dev/my_vg/my_lv  # 将 my_lv 缩小 2GB (有数据丢失风险，需先卸载和检查文件系统)
    ```
    * **注意：** 扩展逻辑卷后，需要同时扩展文件系统才能使用新增的空间。
        * Ext4: `sudo resize2fs /dev/my_vg/my_lv`
        * XFS: `sudo xfs_growfs /dev/my_vg/my_lv` (通常不需要卸载)
* **删除 LV:**
    ```bash
    sudo lvremove /dev/my_vg/my_lv  # 删除逻辑卷
    ```
* **删除 VG:**
    ```bash
    sudo vgremove my_vg  # 删除卷组 (需确保卷组中没有 LV)
    ```
* **删除 PV:**
    ```bash
    sudo pvremove /dev/sdXY  # 删除物理卷 (需确保物理卷没有被任何 VG 使用)
    ```
> Btrfs分卷查看Archlinux系统安装-->[Why Btrfs](https://arch.icekylin.online/guide/rookie/basic-install-detail.html)
---


### 四、分区挂载 (Mounting)

将格式化后的分区或逻辑卷连接到文件系统树中的一个目录，使其可以被访问。

#### 1. 创建挂载点

* 挂载点是一个普通的空目录。
    ```bash
    sudo mkdir /mnt/mydata  # 创建一个名为 mydata 的挂载点
    ```

#### 2. 临时挂载

* **基本挂载：**
    ```bash
    sudo mount /dev/sdXY /mnt/mydata  # 挂载分区 /dev/sdXY 到 /mnt/mydata
    ```
* **指定文件系统类型：** (通常不需要，`mount` 命令可以自动识别)
    ```bash
    sudo mount -t ext4 /dev/sdXY /mnt/mydata
    ```
* **只读挂载：**
    ```bash
    sudo mount -o ro /dev/sdXY /mnt/mydata
    ```
* **重新挂载 (改变挂载选项)：**
    ```bash
    sudo mount -o remount,rw /mnt/mydata  # 将已挂载的 /mnt/mydata 重新挂载为读写模式
    ```
* **查看已挂载的文件系统：**
    ```bash
    mount          # 列出所有已挂载的文件系统
    df -h          # 以人类可读的方式显示磁盘空间使用情况，包括挂载点
    lsblk -f       # 显示块设备的文件系统信息和挂载点
    ```

#### 3. 卸载分区

* 在卸载之前，确保没有程序正在使用该挂载点下的文件。
    ```bash
    sudo umount /mnt/mydata  # 卸载 /mnt/mydata 目录
    sudo umount /dev/sdXY    # 卸载 /dev/sdXY 分区
    ```
* 如果无法卸载（“device is busy”），可以使用 `lsof` 或 `fuser` 命令查找占用进程：
    ```bash
    sudo lsof /mnt/mydata
    sudo fuser -km /mnt/mydata  # 强制杀死占用进程并卸载
    ```

#### 4. 永久挂载 (`/etc/fstab`)

* 为了在系统启动时自动挂载分区，需要编辑 `/etc/fstab` 文件。
* **推荐使用 UUID (Universally Unique Identifier) 来标识分区，因为设备名（如 `/dev/sdb1`）可能会在重启后改变。**
    * 查找分区的 UUID：
        ```bash
        sudo blkid /dev/sdXY
        ```
    * 编辑 `/etc/fstab` 文件：
        ```bash
        sudo nano /etc/fstab  # 或者使用 vi、vim 等编辑器
        ```
    * 在文件末尾添加一行，格式如下：
        ```bash
        UUID=<你的UUID>  /mnt/mydata  ext4  defaults  0  2
        ```
        * **`<你的UUID>`:** 替换为你的分区的实际 UUID。
        * `/mnt/mydata`: 挂载点。
        * `ext4`: 文件系统类型。
        * `defaults`: 常用挂载选项 (rw, suid, dev, exec, auto, nouser, async)。
        * `0`: dump 选项，通常为 0 (不备份)。
        * `2`: fsck 检查顺序，根文件系统为 1，其他为 2，不检查为 0。
* **测试 `/etc/fstab` 配置：**
    ```bash
    sudo mount -a  # 尝试挂载所有在 /etc/fstab 中列出的但尚未挂载的文件系统
    ```
    如果没有任何错误输出，说明配置正确。如果有错误，请检查 `/etc/fstab` 文件。

---------------

## 文件与文件系统的压缩
<ins>Linux文件压缩技术的核心原理主要是通过消除数据冗余来实现的，通常采用无损压缩算法。简单来说，就是想办法用更少的位（bits）来表示相同的信息。</ins>

## 核心原理

1.  ### **数据冗余的消除**
    文件中的数据往往存在大量的重复和可预测的模式。压缩算法会识别这些“冗余”并将其替换为更短的表示。

    * **重复数据查找和替换：** 这是最直观的方法。如果文件中有大量重复的字符序列，例如“AAAAA”，压缩算法会用一个更短的编码来表示“5个A”，而不是重复写5次“A”。
    * **字典编码（如LZ77/LZ78）：**
        * **LZ77** 算法（Lempel-Ziv 77）通过在文件已处理的数据中查找与当前数据流的匹配项。如果找到一个匹配，它就用一个指向匹配位置和匹配长度的“指针”来替换重复数据。这就像建立了一个临时字典，引用已出现过的短语。
        * **LZ78** 算法（Lempel-Ziv 78）则会构建一个显式的字典。它将文件中出现的新的字符串添加到字典中，并用字典中的索引来替换这些字符串。当遇到重复的字符串时，直接用字典索引表示。
    * **熵编码（如霍夫曼编码、算术编码）：** 这种方法基于数据的统计特性。
        * **频率分析：** 某些字符或模式在文件中出现的频率更高。
        * **变长编码：** 熵编码利用这种频率差异，为出现频率高的字符分配更短的编码（例如，用1位表示最常见的字符），为出现频率低的字符分配更长的编码。这样一来，文件的平均编码长度就缩短了，从而实现压缩。**霍夫曼编码**就是典型的例子，它通过构建霍夫曼树来生成最优的变长编码。

2.  ### **无损压缩 vs. 有损压缩**
    * **无损压缩（Lossless Compression）：** Linux文件压缩主要采用的方式。这意味着**在压缩和解压缩后，原始数据可以完全、精确地恢复，没有任何信息损失**。这对于文本文件、程序代码等至关重要，因为任何一点数据丢失都可能导致文件损坏或程序无法运行。`gzip`、`bzip2`、`xz` 等 Linux 命令都属于无损压缩。
    * **有损压缩（Lossy Compression）：** 这种压缩方式会在压缩过程中**舍弃一部分信息以达到更高的压缩比**。解压缩后的数据与原始数据会有所不同，但这种差异通常在特定应用场景下（如图像、音频、视频）是人眼或人耳难以察觉或可以接受的（例如 JPEG 图片和 MP3 音频）。文件压缩通常不使用有损压缩，因为它会改变文件内容。

---

## 常见的Linux压缩工具及其原理简述

| 工具/后缀 | 核心算法                                     | 特点                                                                   |
| :-------- | :------------------------------------------- | :--------------------------------------------------------------------- |
| **gzip (.gz)** | **Deflate** (LZ77 + 霍夫曼编码)             | **速度快**，压缩比适中，应用最广泛。                                 |
| **bzip2 (.bz2)** | **BWT (Burrows-Wheeler Transform)** + **MTF** + 霍夫曼/算术编码 | **压缩比通常比gzip高**，但压缩和解压缩**速度相对较慢**，更消耗CPU。 |
| **xz (.xz)** | **LZMA (Lempel-Ziv-Markov chain Algorithm)** | **压缩比最高**，尤其适合大型文件。但压缩速度通常**最慢**，也更消耗内存。 |
| **zip (.zip)** | 通常是 **Deflate** | **跨平台**压缩格式，可打包多个文件和目录。                            |

**注意：** `tar` 命令 (`.tar` 文件) 本身不是压缩工具，它是一个“打包”工具，用于将多个文件和目录合并成一个单一的归档文件。通常会与 `gzip` (`.tar.gz` 或 `.tgz`)、`bzip2` (`.tar.bz2` 或 `.tbz`) 或 `xz` (`.tar.xz` 或 `.txz`) 结合使用，先打包再压缩。

---

### gzip、bzip2、xz、tar 命令详解

### 1. `gzip` 命令

`gzip`（GNU zip）是 Linux 中最常用的压缩工具之一，采用 **Deflate** 算法进行无损压缩。

* **功能：** 压缩或解压缩文件。默认会生成 `.gz` 后缀的压缩文件并删除原文件。
* **特点：** 压缩速度快，压缩比适中。

**常用选项：**

* `-d`, `--decompress`：解压缩。等同于 `gunzip`。
* `-f`, `--force`：强制执行，覆盖同名文件。
* `-k`, `--keep`：保留原始文件。
* `-v`, `--verbose`：显示详细信息。
* `-c`, `--stdout`：输出到标准输出，不创建文件。
* `-num` (e.g., `-1` 到 `-9`)：设置压缩级别，`-1` 最快，`-9` 最佳（默认 `-6`）。

**使用示例：**

```bash
gzip myfile.txt               # 压缩文件，生成 myfile.txt.gz
gzip -k myfile.txt            # 压缩文件并保留原文件
gzip -d myfile.txt.gz         # 解压缩文件
gzip -l myfile.txt.gz         # 查看压缩信息
gunzip myfile.txt.gz          # 不常用 多用 gzip -d
gzip -v myfile.txt            # 显示压缩过程
zcat myfile.txt.gz            # zcat和gzip -l一样可以查看压缩信息
gzip -9 -c myfile.txt > myfile.txt.gz # 最佳压缩比压缩并保留原本文件
```

### 2. `bzip2`命令
`bzip2`提供比`gzip`更高的**压缩比**，但压缩和解压缩速度相对较慢，且占用更多内存。
* **功能：** 压缩或解压缩文件。默认会生成 .bz2 后缀的压缩文件并删除原文件。
* **特点：**  压缩比高，速度慢，资源占用相对较高。

**常用选项：**

* `-d`, --decompress：解压缩。等同于 bunzip2。
* `-f`, --force：强制执行。
* `-k`, --keep：保留原始文件。
* `-v`, --verbose：显示详细信息。
* `-c`, --stdout：输出到标准输出。
* `-num`，(e.g. -1 到 -9)：设置压缩级别，默认 -9。

**使用示例：**

~~~bash
bzip2 mydocument.txt          # 压缩文件，生成 mydocument.txt.bz2
bzip2 -k mydocument.txt       # 压缩文件并保留原文件
bzip2 -d mydocument.txt.bz2   # 解压缩文件
bzcat mydocument.txt.bz2      #  查看压缩文件内容（不解压）
bzip2 -c -9 mydocument.txt > mydocument.txt.bz2 # 最佳压缩比压缩并保留原文件
~~~

### 3. `xz`命令
`xz`
* **功能**： 压缩或解压缩文件。默认会生成 `.xz` 后缀的压缩文件并删除原文件。
* **特点**： 压缩比最高，速度最慢，压缩时内存消耗最大。

**常用选项：**
* `-d`, `--decompress`：解压缩。等同于 `unxz`。
* `-f`, `--force`：强制执行。
* `-k`, `--keep`：保留原始文件。
* `-c`, `--stdout`：输出到标准输出。
* `-v`, `--verbose`：显示详细信息。
* `-num`, (e.g. -0 到 -9)：设置压缩级别，默认 -6。
* `-l`, `--list`：列出压缩文件信息。

**使用示例：**
~~~bash
xz mydata.log         # 压缩文件，生成 mydata.log.xz
xz -k mydata.log      # 压缩文件并保留原文件
xz -d mydata.log.xz   # 解压缩文件
xzcat mydata.log.xz   # 查看压缩文件内容 (不解压)
xz -l mydata.log.xz   # 列出压缩文件信息 
~~~

### 4. `tar`命令
`tar`（Tape Archive）是一个归档（打包）工具，本身不进行压缩。它将多个文件和目录组合成一个单一的归档文件（“tarball”），常与 ``gzip``、`bzip2`、`xz` 结合使用。

* **功能**： 创建归档文件、从归档中提取文件、列出归档内容。
* **特点**： 仅打包，可与压缩工具结合。

**常用选项：**
* `-c`, `--create`：创建归档。
* `-x`, `--extract`：提取（解包）文件。
* `-t`, `--list`：列出归档内容。
* `-f <archive-file>`：指定归档文件名。
* `-v`, `--verbose`：显示详细信息。
* `-z`, `--gzip`：使用 gzip 压缩/解压缩。
* `-j`, `--bzip2`：使用 bzip2 压缩/解压缩。
* `-J`, `--xz`：使用 xz 压缩/解压缩。
* `-C <directory>`：提取时，将文件更改到指定目录。
* `-p`, 保留备份数据的原本权限与属性，常用于备份(-c)重要的配置文件。
* `-P`, 保留绝对路径，亦即允许备份数据中含有根目录存在之意。
* `--exclude=FILE`, 在压缩的过程中不要将FILE打包。

**常见组合和使用示例：**
* `.tar.gz`或 `.tgz`：`tar + gzip`
* `.tar.bz2`或`.tbz`：`tar + bzip2`
* `.tar.xz`或 `.txz`：`tar + xz`

**使用示例：**
~~~bash
# 打包并用gzip 压缩
tar -czvf myarchive.tar.gz /path/to/my/directory file1.txt

# 解压缩并解包 .tar.gz 文件
tar -xzvf myarchive.tar.gz

# 解压缩 .tar.gz 文件到指定目录
tar -xzvf myarchive.tar.gz

# 打包并用 bzip2 压缩
tar -cjvf finalarchive.tar.bz2 /path/to/final/data

# 打包并用 xz 压缩
tar -cJvf finalarchive.tar.xz /path/to/final/data

# 简建议-f单独写一个选项 (比较不会忘记)
# 查询
tar -jtv -f filename.tar.bz2

# 备份/etc文件夹
time tar -czvp -f /root/etc.tar.gz /etc # 多了time会显示程序运行的时间
time tar -cjvp -f /root/etc.tar.bz2 /etc
time tar -cJvp -f /root/etc.tar.xz /etc

# 仅解开单一文件的方法
# 先找到我们要找的文件名，假设解开 shadow文件
tar -jtv -f /root/etc.tar.bz2 | grep 'shadow'
tar -jxv -f 打包文件.tar.bz2  待解开文件名
tar -jxv -f  /root/etc.tar.bz2 etc/shadow 

# 打包某目录但不含该目录下的某些文件的做法
tar -jcv -f /root/system.tar.bz2 --exclude=/root/etc* \
--exclude=/root/system.tar.bz2 /etc /root

# 仅备份比某个时刻还要新的文件
find /etc -newer /etc/shadow
# 找到一个指定的日期
tar -jcv -f /root/etc.newer.then.passwd.tar.bz2 \
--newer-mtime="2025/06/06" /etc/*

# 标准输入输出流重定向和管道符结合 
# 将/etc整个目录一边打包一边在/tmp解开
cd /tmp
tar -czvf - /etc | tar -xvf -
# 这个操作有点像cp -r /etc /tmp 
~~~
> 如果想要两行输入时，最后面加上反斜杠`\`并立刻按下[Enter]就能够到第二行继续输入了。

-------- 
## 光盘写入工具
###  `mkisofs`、`cdrecord`

### 1. `mkisofs` 命令

`mkisofs` (或在新版系统上通常是 `genisoimage`) 用于从一个目录树创建 ISO 9660 文件系统映像文件。这种映像文件常用于制作 CD/DVD/BD 镜像，以便刻录或在虚拟机中使用。

* **功能：** 将文件和目录打包成 ISO 格式的镜像文件。
* **适用场景：** 制作可引导光盘镜像、数据光盘镜像、虚拟机安装盘等。

**基本语法：**

```bash
mkisofs [选项] -o <输出文件名.iso> <源目录/文件>
```
**常用选项：**

* `-o <输出文件名.iso>`：指定输出的 ISO 镜像文件名。这是最重要的选项，如果没有指定，输出会发送到标准输出。
* `-r, --rock-ridge`：生成 Rock Ridge 扩展，保留 UNIX 文件权限、所有者、组、符号链接、长文件名等 POSIX 属性。强烈推荐使用，以便在 Linux/Unix 系统上正确读取。
* `-J, --joliet`：生成 Joliet 扩展，支持 Windows 上的长文件名和 Unicode 字符。如果你希望在 Windows 和 Linux 上都能良好兼容，通常会同时使用 -r 和 -J。
* `-V <卷标>, --volid <卷标>`：设置 ISO 镜像的卷标 (Volume ID)，即光盘插入系统后显示的名称。
* `-b <引导文件>, --boot-image <引导文件>`：指定用于创建可引导光盘的引导镜像文件（通常是 isolinux/isolinux.bin 或 grub/efi.img）。需要配合其他选项使用，如 -c。
* `-c <引导目录/文件>, --boot-info-table <引导目录/文件>`：指定引导信息目录或文件，通常与 -b 结合使用，用于生成引导目录。
* `-udf`：生成 UDF 文件系统，通常用于 DVD 和蓝光。
* `-m <模式>, --exclude <模式>`：排除与指定模式匹配的文件。
* `-x <目录>, --exclude-dir <目录>`：排除指定的目录。

**使用示例：**
1. 创建最基本的 ISO 镜像：
~~~bash
mkdir my_iso_content
echo "Hello world" > my_iso_content/hello.txt
mkdir my_iso_content/subdir
echo "Another file" > my_iso_content/subdir/another.txt

mkisofs -o mydata.iso my_iso_content
~~~
2. 创建 Linux/Windows 兼容的 ISO 镜像 (常用)：
~~~bash
mkisofs -o my_cross_platform.iso -r -J -V "MyDataDisk" my_iso_content
~~~
`-r` (Rock Ridge) 用于 Linux/Unix 兼容，`-J`(Joliet) 用于 Windows 兼容，`-V` 设置卷标。

### 2. `cdrecord` 命令
`cdrecord` (现在通常是 `wodim` 或 `cdrskin` 的符号链接) 是一个用于刻录 CD、DVD、蓝光盘的命令行工具。它通常与 `mkisofs` 生成的 ISO 镜像配合使用。
- **功能**： 将 ISO 镜像或其他数据刻录到光盘上。
- **适用场景**： 制作物理光盘、备份数据到光盘、刻录音乐 CD。

**基本语法：**
~~~bash
cdrecord [选项] <要刻录的文件.iso>
~~~
**常用选项：**
- `dev=<scsi_id>|/dev/<device>`：指定刻录设备。这是最重要的选项。
  - `<scsi_id>` 格式通常是 bus,target,lun (例如 0,0,0)，可以通过 cdrecord --scanbus 命令查找。
  - `/dev/<device>` 格式是你的光驱设备文件（例如 /dev/sr0 或 /dev/cdrom）。
- `speed=<速度>`：设置刻录速度（例如 `speed=4`，`speed=8`，`speed=max`）。
- `-v`, `--verbose`：显示详细信息，包括刻录进度。
- `blank=<模式>`：擦除可擦写光盘（CD-RW/DVD-RW）。
  - `fast`：快速擦除，只擦除介质的引导区。
  - `all`：完全擦除，擦除整个介质。
- `-dummy`：进行一次虚拟刻录（测试刻录），不实际写入数据。用于在真正刻录前检查设置。
- `-eject`：刻录完成后弹出光盘。

**使用示例：**
1. **查找刻录设备：**
~~~bash
cdrecord --scanbus
~~~
2. **刻录 ISO 镜像到光盘**
```bash
sudo cdrecord dev=/dev/sr0 speed=8 -v my_data.iso
```
3. **擦除 CD-RW 光盘**
```bash
sudo cdrecord dev=/dev/sr0 blank=fast
```
4. **测试刻录 (虚拟刻录)：**
```bash
sudo cdrecord dev=/dev/sr0 -dummy my_data.iso
```
## 其他压缩与备份工具
### `dd` 命令
`dd` 命令 (dataset definition) 是一个功能强大的块级数据复制工具。它以字节为单位复制数据，因此可以用于复制整个硬盘、分区、创建镜像文件、制作启动盘等。

- **功能**： 按块复制数据。
- **适用场景**： 磁盘克隆、分区备份与恢复、制作可引导 USB 驱动器、创建交换文件、安全擦除数据。

**基本语法：**
```bash
dd if=<输入文件> of=<输出文件> [选项]
```
**使用示例：**
1. **克隆整个硬盘 (数据备份/迁移)：**
```bash
sudo dd if=/dev/sda of=/dev/sdb bs=4M status=progress
```
2. **备份分区到文件：**
```bash
sudo dd if=/dev/sda1 of=/path/to/backup/sda1_backup.img bs=4M status=progress
```
3. **制作可引导 USB 驱动器 (从 ISO 镜像)：**
```bash
sudo dd if=ubuntu-24.04-desktop-amd64.iso of=/dev/sdX bs=4M status=progress
```
4. **创建大文件（例如用于交换文件或测试文件）：**
```bash
dd if=/dev/zero of=my_large_flie.img bs=1M count=1024
```
> `dd` 是一个**非常强大的命令**，也被称为<font color="red"><ins>“数据毁灭者”</ins></font>。一个参数的错误就可能导致数据永久丢失。在使用 `dd` 时，请务必再三确认 `if` 和 `of` 参数。
###
-----

# Shell 与 ShellScripts
## Vi、Vim与程序编辑器


