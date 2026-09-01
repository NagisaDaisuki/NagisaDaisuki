---
title: Bat脚本编程笔记
published: 2025-04-27
description: "Bat编程是好文明吗? bat or powershell"
category: bat
tags: ["bat", "cmd", "language", "programming", "code", "windows"]
author: Akeboshi Himari
draft: false
---

# 📚 Windows批处理编程实践

## 什么是批处理命令

**Batch file programming**是微软操作系统自带原生的开发语言，不需要构建任何环境就可以执行的脚本。

Batch file批处理使用cmd.exe执行

## 如何编辑批处理程序

使用任何文本编辑器

## 批处理程序可以做什么

使用一系列内置命令进行自动化操作
> 例如：匹配规则删除文件
>
> 新建文件日志等
>
> 甚至可以批量创建计算机病毒

## 一个基本的批处理文件

输出hello world

~~~
@echo off
Echo "hello world"
pause
~~~

## 命令分类

### 内部命令

`cls`,`ipconfig`等

### 外部命令

`java`和`python`脚本

----------------
----------------

## 算数运算

算数运算符具有优先级，括号`()`进行分组优先级

### 命令模式

`set /a 1+2` `/a`和`/A`都可以，不区分大小写

### 文本模式

~~~
@echo off
set /a var = 1 + 2
echo %var% // 声明var变量
pause
~~~

## 重定向运算

四个符号`>` `>>` `<` `<<`

## 关系运算

`>`大于`<`小于

> type命令可以在终端中显示文件内容(和linux中的cat作用相同)

## 多命令运算符

`&&`：与，具有短路效果，第一个命令为假不会执行第二个命令
`||`：或，具有短路效果，第一个命令为假也会执行第二个命令，第一个命令为真不会执行后面的命令
> `net user`命令会显示计算机上的用户

## 管道符号运算

`A|B`：A命令的输出作为B命令的输入

~~~
dir | find ".txt" 找出当前目录下的所有以.txt为后缀的文件
netstat -an
~~~

> linux下只有文件与目录的区别，windows以后缀名区分文件
>
> `dir`命令显示当前目录下的所有文件，`netstat`是一个常用于查看网络连接、路由表、接口状态等网络相关信息的命令。它在网络故障排查、端口监控、安全检测中非常有用。

--------------------
--------------------

## 批处理基本命令

### 命令格式

`命令 子命令 参数 操作 选项`
> `/?`查看命令帮助信息
例如使用net操作命令

~~~
net /?
net user /?
net user /help 显示完整的帮助信息
NET USER
[username [password | *] [options]] [/DOMAIN]
         username {password | *} /ADD [options] [/DOMAIN]
         username [/DELETE] [/DOMAIN]
         username [/TIMES:{times | ALL}]
         username [/ACTIVE: {YES | NO}]

net user test "password" /add 命令添加用户test
~~~

## 批处理文件参数传递

`.bat`文件接受参数使用`%num`(和shell编程一样作为占位符接收参数)

~~~
net user %1 %2 /add // %1 %2 从外部传入
~~~

参数传递使用空格分隔

## 注释符

~~~
rem comment多行注释
:: comment单行注释
~~~

## 命令提示符

### 颜色命令

颜色数学由两个十六进制数字指定，第一个对应于背景，第二个对应于前景。`color /?`查看具体可选参数

~~~
color 0a // 0是背景色,a是前景色 
~~~

### 标题命令

改变终端标题

~~~
title "title"
~~~

### 时间相关命令

`date`和`time`

`date /T`和`time /T`能获取更纯粹的时间内容
`date /t  && time /t`将日期和时间一起显示

### 启动命令

`start`命令

~~~
start /? 查看帮助手册
start "title" "relative path" // title 表示打开终端的标题 "relative path" 表示打开程序路径
~~~

### 使用其他bat文件

`call`命令(类似函数文件调用)

~~~
1.bat
echo %1 
echo %2
call 2.bat %1 %2
~~~

## 任务列表查看

`tasklist`命令

~~~
tasklist /S （远程ip） /U administrator （以管理员身份登录）/P password （密码）
查看远程计算机的tasklist

tasklist /FI "STATUS eq UNKNOWN"
查看tasklist中状态属于unknown的进程

tasklist /FI "PID EQ 12352"
查看tasklist中PID为12352的进程

tasklist /FI "PID EQ 12352" /FO table
默认输出的table模式

tasklist /FI "PID EQ 12352" /FO csv
输出csv格式

tasklist /FI "PID EQ 12352" /FO csv > task.csv
将csv格式的内容重定向到task.csv文件中
~~~

## 任务终止命令

`taskkill`

~~~
taskkill /IM notepad.exe 根据印象名称关闭程序
taskkill /PID 1230 /PID 2321 /T 根据pid关闭进程与子进程
taskkill /F /IM cmd.exe /T 根据印象名称关闭进程与子进程
~~~

## 文件夹结构查看命令

`tree` `/A` `/F`
> /A以ascii字符显示文件结构而不是扩展字符
>
> /F显示每个文件夹中文件的名称

## 关机命令

`shutdown`

- `shutdown /i`图形化显示关机操作界面
- `shutdown /l`注销计算机
- `shutdown /s` 关闭计算机
- `shutdown /t`定时

## 计划任务命令

`schtasks`

### 🧭 常用格式

~~~
schtasks /<操作> [参数]
~~~

### 🔧 常用操作命令

#### 📅 创建任务

~~~
schtasks /create /tn "任务名" /tr "程序路径" /sc once /st 14:00
~~~

参数说明：

- `/tn`：任务名称(Task Name)
- `/tr`：任务运行的程序或脚本(Task Run)
- `/sc`：计划频率(Schedule: once,daily,monthly,onstart,onlogon等)
- `/st`：开始时间(Start Time，格式：HH:MM)

**例子：每天早上8点运行脚本**

~~~
schtasks /create /tn "BackupScript" /tr "C:\scripts\backup.bat" /sc daily /st 08:00
~~~

#### 📜 查询任务列表

~~~
schtasks /query
~~~

**带详细信息：**

~~~
schtasks /query /v /fo list
~~~

- `/v`：详细模式(Verbose)
- `/fo`：输出格式(Format：table、list、csv)

#### ❌ 删除任务

~~~
schtasks /delete /tn "任务名" /f
~~~

#### 📝 修改任务

~~~
schtasks /change /tn "任务名" /enable
~~~

也可以用来更改运行用户、禁用任务等。

#### ▶️ 运行一次任务（手动触发）

~~~
schtasks /run /tn "任务名"
~~~

#### ⏹️ 停止正在运行的任务

~~~
schtasks /end /tn "任务名"
~~~

### 💡 提示

- 如果任务需要管理员权限运行，建议在创建时指定用户：

~~~
schtasks /create /tn "MyTask" /tr "C:\myapp.exe" /sc once /st 12:00 /ru "SYSTEM"
~~~

## 调用命令

`call`

### 📌 基本用法

#### 1️⃣ 调用另一个批处理脚本

~~~
call other_script.bat
~~~

- 不使用 `call`，主脚本会在运行 `other_script.bat` 后不会返回。
- 使用 `call`，则执行完 `other_script.bat` 后会继续执行主脚本。

#### 2️⃣ 调用并传递参数

~~~
call other_script.bat arg1 arg2
~~~

在`other_script.bat`中可以用`%1`,`%2`来接收参数。

#### 3️⃣ 调用子程序（同一个脚本内部）

~~~
call :label_name
~~~

~~~
@echo off
echo 主脚本开始
call :myFunction
echo 主脚本结束
exit /b

:myFunction
echo 我是子程序
exit /b
~~~

- `:label_name` 是一个脚本内的子程序标签
- `exit /b`用于从子程序返回（不是结束整个脚本）

#### 🔁 常见场景

1. 调用多个批处理文件，按顺序执行
2. 在脚本中使用函数/模块化结构
3. 根据条件选择性地调用不同子程序

## 批处理环境变量

`set`

### 📌 基本用法

## 目录浏览命令dir

### 📌 基本用法

#### 🔑 查看所有信息（包括隐藏目录文件）

`dir /a`

#### 🗝 以小写形式输出

`dir /l`

### 目录重命名命令

`ren`,`rename`

### 目录拷贝命令

`copy`,`cp`

### 文件删除命令

`del`,`delete`

### 文件剪切命令

`move`,`mv`

## 网络相关命令

1. `net user`用户操作命令

- 删除用户指令

~~~
net user username /delete
~~~

- 添加用户指令

~~~
net user username (password | *) /add
~~~

2. `net localgroup`用户组操作命令

- 向本地管理组添加用户

~~~
net localgroup administrators himari /add
~~~

- 删除指定本地管理组用户

~~~
net localgroup users himari /delete
~~~

3. 主机连通性命令`ping`指定的主机，直到停止

- 设置发送缓冲区大小

```
ping -l 65500 127.0.0.1
```

- ping指定主机直到停止

```
ping -l 444 -t 127.0.0.1
```

4. 网络连接命令`telnet`

> win10默认关闭，要去控制面板中的**程序**-->**程序和功能**-->**启动或关闭windows功能打开**

5. 网络路由信息查看命令`tracert`

### 🧭 tracert 命令（Windows）

#### 📌 用途

查看 **数据包从你本地出发，一跳一跳经过的网络节点**，直到目标地址。

可以用来：

- 排查网络延迟
- 判断哪一段网络不通
- 分析出站路径

#### ✅ 基本语法

~~~
tracert [选项] 目标地址
~~~

```
tracert 192.168.0.1 对本地路由进行跟踪
tracert www.baidu.com 对百度网址进行跟踪
```

6. 网络适配器命令`ipconfig`

`ipconfig`是 Windows 系统中用来查看和管理本机网络配置信息的超常用命令之一。

### 🧭 ipconfig 命令作用

主要用于查看本机：

- IP地址
- 子网掩码
- 默认网关
- DNS配置
- 当前网络状态

### ✅ 常用命令大全

|命令|功能说明|
|:---:|:---:|
|`ipconfig`|查看简要 IP 配置信息|
|`ipconfig /all`|查看详细配置信息（包括物理地址、DNS等）|
|~~ipconfig /release~~|释放当前IP(DHCP模式下)|
|`ipconfig /renew`|重新申请IP(DHCP模式下)|
|`ipconfig /flushdns`|清除DNS缓存|
|`ipconfig /displaydns`|显示DNS缓存|
|`ipconfig /registrdns`|刷新DHCP租约并重新注册DNS|

7. `ARP`信息命令

### 📡 arp 命令详解（Windows）

#### 🎯 用途

查看或修改本地ARP缓存表，用于**IP<-->MAC地址映射的管理与排错**

### 🧾 常用命令速查表

|**命令**|**功能说明**|
|:---:|:---:|
|`arp -a`|显示本地ARP缓存表(IP<-->MAC映射)|
|`arp -a 192.168.1.1`|查看指定接口的 ARP 缓存|
|`arp -d IP地址`|删除特定 IP 的 ARP 缓存记录|
|arp -s IP地址 MAC地址|添加静态 ARP 映射（不会随系统重启保留）|

### 📌 注意事项

- `arp` 只作用于本地的 IP/MAC 映射缓存。
- ARP 表仅包含最近通信过的设备，**不是扫描整个局域网的工具**。

## 条件判断结构

### 😎 if-else结构

#### ✅ 基本语法

~~~
if 条件(
    命令1
) else (
    命令2
)
~~~

### 🔍 示例：判断文件是否存在

~~~
@echo off
if exist "C:\test.txt"(
    echo 文件存在！
) else (
    echo 文件不存在。
)
pause>nul
~~~

### 🧠 for 循环结构

#### ✅ 遍历文件夹中的所有文件

~~~
@echo off
for %%f in (*.txt) do (
    echo 找到文件: %%f
)
pause>nul
~~~

> ⚠ 注意：在 .bat 脚本中用 **%%变量**，而在命令行窗口直接输入时只用一个 **%变量**。
>
#### 😚 遍历目录(文件夹)

~~~
@echo off
for /d %%a in (*) do echo %%a
pause
~~~

#### 🔄 遍历文件夹中的所有子目录和文件（递归）(recursion)

~~~
for /r "C:\MyFolder" %%f in (*.jpg) do (
    echo 发现图片：%%f
)
pause
~~~

#### 🧪 遍历一个列表

~~~
@echo off
for %%i in (苹果 香蕉 西瓜) do (
    echo 水果：%%i
pause
~~~

~~~
@echo off
rem for 遍历数字 /l
for /l %%i in (1,1,20) do ping %1.%%i
pause
~~~

#### 🧠 if 与 for 嵌套使用（判断文件是否包含关键字）

~~~
@echo off
for %%f in (*.txt) do (
    findstr "关键字" %%f >nul
    if errorlevel 1(
        echo 没找到：%%f
    ) else (
        echo 找到关键字于：%%f
    )
)
pause
~~~

#### 逐行读取文件内容

~~~
@echo off
rem for test
for /f %%i in (for.cmd) do echo %%i
~~~

#### 🔥 常用增强参数

|**语法**|**说明**|
|:---:|:---:|
|`for /r`|递归子目录|
|`for /f`|逐行读取文件内容|
|`for /d`|遍历目录|
|`if exist`|判断文件或目录存在|
|`if "%var%"==""`|判断变量是否为空|
|`if not defined VAR`|判断变量未定义|

### ✅ 命名习惯（但不是语法限制）

|**变量名**|**通常用途**|**示例**|
|:---:|:---:|:---:|
|`%%i`|通用索引(index)|`for %%i in (...) do`|
|`%%f`|文件(file)相关循环|`for %%f in (*.txt) do`|
|`%%d`|目录(dir)相关|`for /d %%d in (*) do`|

## goto命令

### ✅ 基本语法

``goto 标签名``

~~~
:标签名
rem 在这里执行跳转后的代码
~~~

### 🧩 示例：if 判断 + goto 跳转

~~~
@echo off
set /p answer=是否继续?(y/n):

if /i "%answer%"=="y" goto continue
if /i "%answer%"=="n" goto exit
:continue
echo 你选择了继续
goto end

:exit
echo 已退出程序

:end
pause>nul
~~~

### ♻ 示例：goto 构造简单循环

~~~
@echo off
set /a count=0

:loop
set /a count+=1
echo 当前计数：%count%

if %count% lss 5 goto loop
echo 循环结束
pause
~~~

## set命令

`set` 是 Windows 批处理脚本中最基础、最常用的命令之一，用于定义、读取和修改变量。

### 🧩 基本语法

`set 变量名=值`

### ✅ 示例

~~~
set name=张三
echo 你好，%name%
~~~

### 🔢 示例：数学运算

~~~
@echo off
set /a a=5
set /a b=3
set /a sum=a+b
echo 和是：%sum%
~~~

### ⌨ 示例：用户输入

~~~
@echo off
set /p name=请输入你的名字：
echo 你好，%name%
~~~

### 🔁 示例：循环中使用变量（延迟扩展）

~~~
@echo off
setlocal enabledelayedexpansion
for /l %%i in (1,1,5) do (
    set /a val=%%i*2
    echo 第%%i项:!val!
)
~~~

>🚨 注意：循环中需要用 **!变量名!** 而不是 ~~%变量名%~~，并配合 `setlocal enabledelayedexpansion`

### 🧽 示例：清空变量

`set var=`

### 💡 高级技巧

- `set "var=value"`（推荐写法，防止空格问题）
- `set /a i+=1`支持累加减法等
- `set /p`可用于制作简易菜单输入

## 💡 什么是延迟扩展（Delayed Variable Expansion）
>
> 延迟扩展 = **让变量在运行到那一行时才获取值**，而不是在脚本解析阶段就确定值。
>
### 📌 默认行为（非延迟）

批处理在执行 **for/if** 结构前，会先整体解析整段语句中的 %变量% —— 也就是说 “提前确定值”！

这就导致：你在 **for** 循环中改变了变量，但 %变量% 仍然是旧值。

### 🧨 问题例子（没开启延迟扩展）

~~~
@echo off
set count=0
for /l %%i in (1,1,3) do (
    set /a count+=1
    echo 循环中：%count%
)
~~~

### 💥 输出是

~~~
循环中：0
循环中：0
循环中：0
~~~

### ✅ 正确写法：开启延迟扩展

~~~
@echo off
setlocal enabledelayedexpansion
set count=0
for /l %%i in (1,1,3) do (
    set /a count+=1
    echo 循环中：!count!
)
~~~

## at命令

`at` 命令是 Windows（尤其是早期版本）中的一个计划任务命令，用于在指定时间运行程序或命令。它已经被较新的 `schtasks` 命令取代，但在某些系统上仍然可用。

### 🧭 基本格式

~~~
at [时间] [命令]
~~~

时间格式通常是**24小时制**，如 `14:30`

### ✅ 示例用法

1. 在下午2点30分执行一个程序：
`at 14:30 "notepad.exe"`
2. 执行一个批处理脚本：
`at 18:00 xxx.bat`
3. 查看当前已排的任务：
`at`
4. 删除任务：
`at [任务ID] /delete`

### ⚠️ 注意事项

|**限制/说明**|**详情**|
|:---:|:---:|
|✅ 管理员权限|需要以 **管理员身份运行命令提示符** 才能使用 `at`|
|❌ 不支持日期计划|只能设置“**今天**几点执行”，不支持设置“哪天”|
|❌ 在 Win10 后被废弃|Windows 8/10/11 推荐使用 schtasks 命令|
|❌ 无法持久保存|重启后计划任务通常会丢失（默认行为）|

### 🆕 推荐替代：schtasks

~~~
schtasks /create /tn "OpenNotepad" /tr "notepad.exe" /sc once /st 14:30
~~~

## find命令和findstr命令

- `find`命令查找的是纯文本字符串

~~~
find "hello" myfile.txt
// 查找文本中包含hello的行，不能使用正则表达式
/i 忽略大小写
/c 统计匹配的行数
/v 查找不包含某字符串的行
~~~

- `findstr`功能更强可以用简单正则

~~~
findstr /R "^A.*Z$" myfile.txt
// 查找以A开头以Z结尾的行
/s 递归子目录
/i 忽略大小写
/r 正则模式
/c:"exact phrase"查找精确短语
~~~

# ✅ 示例：模糊查找并杀掉进程名中包含 chrome 的程序

~~~
for /f "tokens=2 delims= " %%i in ('tasklist ^| findstr /i chrome') do taskkill /pid %%i /f 
~~~

- `/f`：逐行读取文件内容
- `tokens=2 delims=`：取第二行，按空格分割
- `%%i`和`%i`为在bat文件内运行和cmd终端运行
- `('tasklist ^| findstr /i chrome')`：这里使用`''`和`^|`转义符是为了防止`for`命令将前后分为两个语句
- `taskkill /pid %%i /f`：将指定的进程名程序杀死

## 🧩 扩展用法（高级）

### ▶ 只杀掉特定用户下的进程

~~~
tasklist /v | findstr /i "chrome myusername"
~~~

### ▶ 匹配多个关键词

~~~
tasklist | findstr /i "chrome firefox"
~~~

### ▶ 过滤多个字段（通过正则）

~~~
tasklist | findstr /r /i "notepad.*Console"
~~~

# ✅ for 循环常用语法和选项

## 🧩 常用结构一：遍历文件列表

~~~
for %%f in (*.txt) do echo %%f
~~~

## 🧩 常用结构二：读取文件内容（逐行处理）

~~~
for /f "tokens=1,2 delims= " %%a in (data.csv) do echo 第一列=%%a 第二列=%%b
~~~

## 🧩 常用结构三：命令输出处理

~~~
for /f "usebackq tokens=*" %%i in ('tasklist ^| findstr notepad') do echo %%i
~~~

- `usebackq`：让命令用反引号包围
- `tokens=*`：整行提取(防止空格截断)

## 🔧 for 参数说明

|**参数**|**作用**|
|:---:|:---:|
|`/f`|从文本文件或命令输出中逐行读取|
|`/r`|递归遍历目录|
|`/d`| 仅匹配目录名|
|`tokens=n`|指定取第几列(n可以是多个)|
|`delims=x`|指定分隔符(默认为空格和制表符)|
|`usebackq`|使用反引号执行命令/支持文件路径含空格|

# ✅ if 语句常用结构

## 🧩 结构一：字符串比较

~~~
if "%var%"=="hello" echo 是hello
~~~

## 🧩 结构二：数字比较

~~~
if %num% GEQ 100 echo 大于等于100
~~~

|**比较符**|**含义**|
|:---:|:---:|
|`==`|等于(字符串)|
|`NEQ`|不等于|
|`LSS`|小于|
|`LEQ`|小于等于|
|`GTR`|大于|
|`GEQ`|大于等于|

> ⚠ 注意：数字比较时变量不能加引号。
>
## 🧩 结构三：文件/目录判断

~~~
if exist myfile.txt echo 文件存在
if not exist myfolder\NUL echo 文件夹不存在
~~~

🧩 结构四：带括号的多语句判断（推荐）

~~~
if "%var%"=="yes" (
    echo 用户确认
    echo 正在继续
) else (
    echo 用户取消
)
~~~

# 📝 练习1：遍历所有 .log 文件，并显示文件名和行数

~~~
for %%f in (*.log) do (]
    echo 文件：%%f
    find /c /v "" "%%f"
)
~~~

## ✅ 各部分含义

|**部分**|**含义**|
|:---:|:---:|
|`find`|Windows的文本查找命令|
|`/c`|只显示匹配行的数量|
|`/v ""`|匹配所有"**不包含空字符串**"的行->相当于"所有行"|
|`%%f`|要处理的文件名(在`for`循环中)|

# 📝 练习3：用 tasklist 和 if 判断某进程是否存在

~~~
tasklist | findstr /i notepad >nul
if errorlevel 1 (
    echo Notepad 没有运行
) else (
    echo Notepad 正在运行
)
~~~

# ✨字符串截取语法

## ✅ 通用语法

~~~
%变量名:~起始位置,长度%
~~~

- *起始位置*：从0开始
- *长度*：截取的字符数(可以省略，表示到结尾)

## ✅ 举例说明

### 📆 示例1：处理 %date%

假设 *%date% = 2025/04/29*

| 表达式               | 结果     | 说明                         |
|----------------------|----------|------------------------------|
| `%date:~0,4%`        | `2025`   | 年                           |
| `%date:~5,2%`        | `04`     | 月                           |
| `%date:~8,2%`        | `29`     | 日                           |
