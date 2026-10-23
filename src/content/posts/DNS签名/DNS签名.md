---
title: 贝壳云上配置的alist域名签发的反代DNS签发证书过期使用acme.sh自动签名
published: 2026-10-24
description: 签名签名签名签名签名签名
image: ./Capri.webp
tags: [Let's Encrypt, ZeroSSL, DNS证书, acme.sh, 反代, nginx, alist, Cloudflare]
category:
draft: false
---

## 原因

部署在家宽公网上的alist突然暴https错误检查是之前第一次DNS签发证书过期了，第一次如何配置反代的证书方式也遗忘了，这一次决定重新用 `acme.sh` (ZeroSSL)签发DNS证书。

## 为什么是 DNS模式?

### 🔄 “正常”签发：HTTP-01 验证

这是最直观的方式。CA 机构（如 Let's Encrypt）会要求你的网站在特定路径下（通常是 /.well-known/acme-challenge/）放置一个包含特定随机字符串的文件。

- 验证方式：CA 的服务器会主动向你域名对应的 80 端口发起 HTTP 请求，检查那个文件是否存在且内容正确。

- 前提条件：你的服务器必须拥有公网 IP，并且 80 端口对公网开放，能让 CA 从外部访问到。

但是家庭宽带通常封锁了 80 端口，导致 CA 无法访问，证书自然无法自动续期。

### 🔑 DNS 模式：DNS-01 验证

DNS 验证的核心思路是：**“谁控制了域名的 DNS 解析权，谁就拥有这个域名”**。

- 验证方式：CA 会给你一段随机的字符串，要求你以 TXT 记录的形式，添加到域名的 DNS 解析中（记录名通常是 _acme-challenge.你的域名）。CA 通过查询 DNS 来确认这条记录存在且内容正确，即可通过验证。

- 前提条件：你不需要开放服务器的任何端口，只需要拥有该域名在 DNS 服务商（如 Cloudflare）的管理/API 权限，能够添加和删除 TXT 记录即可。

使用 `acme.sh` 配合 `Cloudflare API Token` 的场景下，这个过程是完全自动的：acme.sh 会通过 API 自动添加验证用的 TXT 记录，等 Let's Encrypt 验证通过后，再自动删除它。

### 两种模式的核心区别对比

| 对比维度   | HTTP-01 验证（“正常”方式）          | DNS-01 验证（DNS 模式）                              |
| :--------- | :---------------------------------- | :--------------------------------------------------- |
| 验证依据   | 对网站文件的控制权                  | 对域名DNS记录的控制权                                |
| 网络要求   | 需要开放服务器的**80**端口          | 无需开放任何端口，无需公网IP                         |
| 适用场景   | 拥有公网IP和开放端口的常规WEB服务器 | 内网服务器、家庭宽带、防火墙严格等无法开放端口的环境 |
| 通配符证书 | 不支持（无法为`*.example.com`申请   | 支持，是申请通配符证书的唯一方式                     |
| 核心优势   | 配置简单，主流工具默认支持          | 灵活、无端口暴露、支持通配符，适用场景更广           |

## 操作

### 第一步：在 Cloudflare 创建 API Token

1. 登录 Cloudflare 控制台，点击右上角头像 -> My Profile -> API Tokens。

2. 点击 Create Token，选择 Edit zone DNS 模板。

3. Permissions 选择 Zone -> DNS -> Edit，Zone Resources 选择 Include -> Specific zone -> 你的域名。

4. 点击 Continue to summary -> Create Token，立即复制并保存好生成的 Token（只显示一次）。

### 第二步：在宿主机安装 acme.sh

通过 SSH 跳板连接到你的贝壳云

```shell
ssh xxx@xxx.xxx.com(正常访问路由器可以用公网ip地址也可以用绑定的域名地址) -p 暴露的ssh端口号(比如我的路由器设置的10022)
ssh root@192.168.123.xx (本地贝壳云或其他局域网内部署docker设备静态地址)
```

执行以下命令安装`acme.sh`：

```shell
curl https://get.acme.sh | sh -s email=你的邮箱@qq.com
```

> 安装完成后，重新加载 shell 环境或执行 source ~/.bashrc 使 acme.sh 命令生效
>
> 我这里直接 ~/.acme.sh/acme.sh 执行了，因为没有bash

### 第三步：签发证书

设置 Cloudflare Token 环境变量，并使用 DNS 模式签发证书:

```shell
export CF_Token="刚才创建的Cloudflare_API_Token"

# 签发单域名证书
~/.acme.sh/acme.sh --issue --dns dns_cf -d 要签发的子域名
```

> 如果后续需要覆盖所有子域名，可以签发泛域名证书：

```shell
~/.acme.sh/acme.sh --issue --dns dns_cf -d "*.主域名" -d "主域名"
```

### 第四步：将证书部署到 Nginx 容器

如果 Nginx 是 Docker 容器，需要将证书文件写入容器内 /etc/nginx/certs/ 目录。关键在于，利用 acme.sh --install-cert 命令，并将 --reloadcmd 设置为让 Nginx 容器内部重新加载配置的命令。

```shell
~/.acme.sh/acme.sh --install-cert -d 要签发的子域名 \
--key-file /etc/nginx/certs/privkey.pem \
--fullchain-file /etc/nginx/certs/fullchain.pem \
--reloadcmd "docker exec pure-nginx nginx -s reload"
```

> 注意：--reloadcmd 中的 pure-nginx 是 Nginx 容器名（从 docker ps 结果中获取的）。这个命令会在每次证书更新后，自动让 Nginx 重新加载配置，无需重启容器，不会中断现有连接。

#### 关于路径的说明

- `--key-file` 和 `--fullchain-file` 后的路径，应与`alist.conf`中`ssl_certificate`配置的路径完全一致。

- `acme.sh`会自动处理从宿主机到容器的文件写入（通过 Docker 卷映射）。如果容器没有将`/etc/nginx/certs/`映射到宿主机，则需要先修改`docker run`或`docker-compose.yml`，添加一个卷映射（例如`-v /your/host/certs:/etc/nginx/certs`），然后再执行上述安装命令。

### 第五步：验证与自动续期

1. 验证证书：执行 `openssl x509 -in /etc/nginx/certs/fullchain.pem -noout -dates`（在宿主机或容器内均可），确认到期时间已更新。
2. 自动续期：`acme.sh` 安装时会自动添加cron任务，默认每天检查一次并自动续期，无需任何额外操作。
