---
title: 前端跨域处理方案
date: 2022-08-10
isTimeLine: true
tags:
  - 计算机网络
  - 跨域
  - 前端开发
description: 浏览器同源策略、跨域问题及其解决方案
---

# 前端跨域处理方案

## 同源策略

同源策略是浏览器的一个重要的安全策略，它用于限制一个源的文档或者它加载的脚本如何能与另一个源的资源进行交互。

### 什么是同源

- 协议相同
- 域名相同
- 端口相同

## 常见跨域场景

1. 前后端分离开发
2. 调用第三方API
3. 多个子域名之间的通信
4. CDN资源访问

## 跨域解决方案

### 1. CORS（跨域资源共享）

```javascript
// 服务器端配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
```

### 2. JSONP

```javascript
function jsonp(url, callback) {
  const script = document.createElement('script')
  script.src = `${url}?callback=${callback}`
  document.body.appendChild(script)
}
```

### 3. 代理服务器

```javascript
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://target-domain.com',
        changeOrigin: true
      }
    }
  }
}
```

### 4. postMessage

```javascript
// 发送消息
window.postMessage('Hello', 'http://receiver.com')

// 接收消息
window.addEventListener('message', (event) => {
  if (event.origin !== 'http://sender.com') return
  console.log(event.data)
})
```

### 5. WebSocket

```javascript
const ws = new WebSocket('ws://api.example.com')
ws.onopen = () => {
  console.log('连接已建立')
}
ws.onmessage = (event) => {
  console.log('收到消息:', event.data)
}
```

## 最佳实践

### 1. 安全性考虑

- 避免使用 `Access-Control-Allow-Origin: *`
- 合理配置 CORS 头部
- 验证请求来源

### 2. 性能优化

- 合理使用缓存
- 减少跨域请求次数
- 选择合适的跨域方案

### 3. 开发环境配置

- 使用代理服务器
- 统一的跨域处理方案
- 环境变量管理

## 常见问题与解决

### 1. OPTIONS 预检请求

- 产生原因
- 如何处理
- 优化策略

### 2. Cookie 跨域

- withCredentials 配置
- 服务器端配置
- 安全考虑

### 3. 跨域错误处理

- 错误捕获
- 降级处理
- 用户提示

## 总结

:::tip
跨域是前端开发中常见的问题，选择合适的跨域解决方案需要考虑安全性、性能、维护性等多个方面。了解各种跨域方案的优缺点，结合实际场景选择最适合的解决方案，是提高前端开发效率的关键。
:::
