---
title: HTTP基础知识
date: 2022-01-10
isTimeLine: true
tags:
  - 计算机网络
  - HTTP
description: HTTP协议的基本概念、工作原理及其在Web开发中的应用
---

# HTTP基础知识

## HTTP简介

HTTP（HyperText Transfer Protocol）是一个用于传输超文本的应用层协议，是Web应用程序的基础。它采用客户端-服务器模型，通过TCP连接传输数据。

### 工作流程

1. 建立TCP连接
2. 客户端发送HTTP请求
3. 服务器处理请求并返回响应
4. 关闭连接（HTTP/1.0）或保持连接（HTTP/1.1）

## HTTP特点

1. 无状态性：服务器不会保存客户端的状态信息
2. 可扩展性：通过请求头和响应头可以扩展协议的功能
3. 请求-响应模式：一次完整的HTTP通信由请求和响应构成
4. 简单快速：协议简单，通信速度快

### 无状态的解决方案

```javascript
// 1. Cookie方案
app.get('/api/user', (req, res) => {
  // 设置Cookie
  res.cookie('sessionId', 'abc123', { maxAge: 900000, httpOnly: true })
})

// 2. Session方案
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
)

// 3. Token方案
const token = jwt.sign({ userId: user.id }, 'secret_key')
```

## HTTP报文结构

### 请求报文

- 请求行（请求方法、URL、协议版本）
- 请求头部（Header）
- 空行
- 请求体（Body）

```http
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer token123

{
  "username": "john_doe",
  "email": "john@example.com"
}
```

### 响应报文

- 状态行（协议版本、状态码、状态描述）
- 响应头部（Header）
- 空行
- 响应体（Body）

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{
  "id": 1,
  "username": "john_doe",
  "status": "success"
}
```

## HTTP方法

- GET：获取资源

  ```javascript
  fetch('https://api.example.com/users')
    .then((response) => response.json())
    .then((data) => console.log(data))
  ```

- POST：提交数据

  ```javascript
  fetch('https://api.example.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John' })
  })
  ```

- PUT：更新资源
- DELETE：删除资源
- HEAD：获取报文头部
- OPTIONS：询问支持的方法

## HTTP状态码

### 1xx：信息

- 100 Continue：继续发送请求

### 2xx：成功

- 200 OK：请求成功
- 201 Created：资源创建成功
- 204 No Content：请求成功但无返回内容

### 3xx：重定向

- 301 Moved Permanently：永久重定向
- 302 Found：临时重定向
- 304 Not Modified：资源未修改

### 4xx：客户端错误

- 400 Bad Request：请求语法错误
- 401 Unauthorized：未授权
- 403 Forbidden：禁止访问
- 404 Not Found：资源不存在

### 5xx：服务器错误

- 500 Internal Server Error：服务器内部错误
- 502 Bad Gateway：网关错误
- 503 Service Unavailable：服务不可用

## HTTP缓存机制

### 强缓存

```javascript
// 服务器端设置
res.setHeader('Cache-Control', 'max-age=3600')
res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString())
```

### 协商缓存

```javascript
// Last-Modified/If-Modified-Since
app.get('/api/data', (req, res) => {
  const lastModified = req.get('If-Modified-Since')
  if (lastModified && resourceNotModified) {
    res.status(304).end()
  }
  res.setHeader('Last-Modified', new Date().toUTCString())
})

// ETag/If-None-Match
app.get('/api/data', (req, res) => {
  const etag = req.get('If-None-Match')
  if (etag && resourceNotModified) {
    res.status(304).end()
  }
  res.setHeader('ETag', generateETag(resource))
})
```

## HTTPS

### 与HTTP的区别

1. 安全性：使用SSL/TLS加密通信
2. 端口号：HTTPS默认使用443端口
3. 证书认证：需要CA颁发的SSL证书

### TLS/SSL工作原理

1. 握手过程

   ```javascript
   // Node.js HTTPS服务器示例
   const https = require('https')
   const fs = require('fs')

   const options = {
     key: fs.readFileSync('private-key.pem'),
     cert: fs.readFileSync('certificate.pem')
   }

   https
     .createServer(options, (req, res) => {
       res.writeHead(200)
       res.end('Hello Secure World!')
     })
     .listen(443)
   ```

2. 加密机制

   - 对称加密：数据传输
   - 非对称加密：密钥交换
   - 哈希算法：数据完整性

3. 性能优化
   - OCSP Stapling
   - Session重用
   - 证书链优化

## 最佳实践

### 安全性

```javascript
// 设置安全相关的响应头
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})
```

### 性能优化

```javascript
// 启用压缩
app.use(compression())

// 实现HTTP/2
const spdy = require('spdy')
spdy.createServer(options, app).listen(443)
```

## 总结

:::tip
HTTP协议是现代Web应用的基石，其工作原理对于开发高质量的Web应用至关重要。掌握HTTP的基本概念、报文结构、方法、状态码等知识，有助于更好地处理网络通信问题和优化应用性能。在实际开发中，要注意安全性、性能优化，并根据具体场景选择合适的缓存策略和通信方式。
:::
