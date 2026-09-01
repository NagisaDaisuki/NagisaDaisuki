---
title: ssh-keygen generate
published: 2025-05-05
description: "I have a key and you have a door.This key refers to private key and door are public key."
category: ssh
tags: ["ssh", "ssh-keygen", "remote login"]
author: Akeboshi Himari
draft: false
--- 

# 🛠️ 一、在本地生成 SSH 密钥对

## 打开终端，输入以下命令

~~~
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
~~~

## 参数说明

- `-t rsa`:指定密钥类型为RSA
- `-b 4096`:指定密钥长度(4096比较安全)
- `-C`:添加注释，可选

## 然后会提示你保存路径，默认是

`/home/your_user/.ssh/id_rsa`

按回车即可（使用默认路径），然后设置密码（也可以直接回车跳过，无密码）

# 📂 二、将公钥复制到服务器

## 方法1：使用`ssh-copy-id`

`ssh-copy-id username@server_ip`
`ssh-copy-id Himari@106.15.58.39`

它会自动把本地的 ~/.ssh/id_rsa.pub 添加到服务器的 ~/.ssh/authorized_keys 中。

你会被要求输入服务器密码，配置成功后就可以免密登录了。

## 方法2：手动复制公钥

1. 查看本地公钥内容

```
cat ~/.ssh/id_rsa.pub
```

2. 登录远程服务器

```
ssh username@server_ip
```

3. 在服务器上创建`.ssh`文件夹(如果没有):

```
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

4. 编辑`authorized_keys`文件，将公钥粘贴进去

```
nvim ~/.ssh/authorized_keys
```

粘贴后保存，然后执行

```
chmod 600 ~/.ssh/authorized_keys
```

# 🔐 三、测试免密登录

## 退出服务器，然后尝试重新连接

```
ssh username@server_ip
```

如果一切配置正确，将无需输入密码，自动登录。
