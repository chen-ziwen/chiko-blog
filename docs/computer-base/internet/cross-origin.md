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

```javascript
// 判断是否同源
function isSameOrigin(url) {
  const current = new URL(window.location.href)
  const target = new URL(url)

  return current.protocol === target.protocol && current.hostname === target.hostname && current.port === target.port
}
```

## 常见跨域场景

### 接口跨域

```javascript
// 前端发起跨域请求
fetch('https://api.example.com/data', {
  method: 'GET',
  credentials: 'include' // 携带Cookie
}).catch((error) => {
  console.error('跨域请求失败:', error)
})
```

### 资源跨域

```html
<!-- 图片跨域 -->
<img src="https://cdn.example.com/image.jpg" crossorigin="anonymous" />

<!-- 字体跨域 -->
<style>
  @font-face {
    font-family: 'CustomFont';
    src: url('https://fonts.example.com/font.woff2') format('woff2');
    font-display: swap;
  }
</style>
```

## 跨域解决方案

### CORS（跨域资源共享）

```javascript
// 服务器端配置（Express）
app.use((req, res, next) => {
  // 允许特定域名访问
  res.header('Access-Control-Allow-Origin', 'https://your-app.com')
  // 允许携带Cookie
  res.header('Access-Control-Allow-Credentials', 'true')
  // 允许的请求方法
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  // 允许的请求头
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // 预检请求缓存时间
  res.header('Access-Control-Max-Age', '86400')

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
```

### 代理服务器

```javascript
// Vite开发环境代理配置
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

// Nginx生产环境代理配置
server {
  listen 80;
  server_name your-app.com;

  location /api/ {
    proxy_pass https://api.example.com/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### JSONP

```javascript
// JSONP封装
function jsonp(url, callback) {
  const script = document.createElement('script')
  const callbackName = 'jsonp_' + Date.now()

  // 创建全局回调函数
  window[callbackName] = (data) => {
    callback(data)
    document.body.removeChild(script)
    delete window[callbackName]
  }

  script.src = `${url}?callback=${callbackName}`
  document.body.appendChild(script)
}

// 使用示例
jsonp('https://api.example.com/data', (data) => {
  console.log('JSONP响应:', data)
})
```

### postMessage跨域通信

```javascript
// 父窗口发送消息
const iframe = document.querySelector('iframe')
iframe.onload = () => {
  iframe.contentWindow.postMessage('Hello from parent', 'https://child.example.com')
}

// 子窗口接收消息
window.addEventListener('message', (event) => {
  // 验证来源
  if (event.origin !== 'https://parent.example.com') return

  console.log('收到消息:', event.data)
  // 回复消息
  event.source.postMessage('Hello from child', event.origin)
})
```

## 安全考虑

### CORS安全配置

```javascript
// 严格的CORS配置
app.use((req, res, next) => {
  // 只允许特定域名
  const allowedOrigins = ['https://app1.com', 'https://app2.com']
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  // 禁止携带凭证
  res.header('Access-Control-Allow-Credentials', 'false')

  // 限制请求方法
  res.header('Access-Control-Allow-Methods', 'GET, POST')

  next()
})
```

### CSP配置

```javascript
// 设置Content-Security-Policy
app.use((req, res, next) => {
  res.header(
    'Content-Security-Policy',
    `
    default-src 'self';
    img-src 'self' https://cdn.example.com;
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    font-src 'self' https://fonts.example.com;
  `
      .replace(/\s+/g, ' ')
      .trim()
  )
  next()
})
```

## 最佳实践

### 错误处理

```javascript
// 前端统一处理跨域错误
function fetchWithCORS(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .catch((error) => {
      if (error instanceof TypeError && error.message.includes('CORS')) {
        console.error('CORS错误：请检查服务器配置')
      }
      throw error
    })
}
```

### 性能优化

```javascript
// 预检请求优化
app.use((req, res, next) => {
  // 增加预检请求缓存时间
  res.header('Access-Control-Max-Age', '86400')

  // 允许压缩
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept-Encoding')

  next()
})

// 使用浏览器缓存
app.get('/api/data', (req, res) => {
  res.header('Cache-Control', 'max-age=3600')
  // 返回数据
})
```

## 总结

:::tip
跨域是前端开发中常见的问题，合理使用CORS、代理服务器等解决方案可以有效处理跨域访问需求。在实现跨域方案时，需要注意安全性，合理配置CORS和CSP策略，同时考虑性能优化，减少不必要的预检请求。选择合适的跨域方案时，要根据具体场景和需求权衡利弊。
:::
