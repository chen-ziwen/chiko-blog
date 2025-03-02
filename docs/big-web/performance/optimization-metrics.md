---
title: 前端性能优化指标与策略
date: 2024-05-26
isTimeLine: true
tags:
  - javascript
  - 性能优化
---

# 前端性能优化指标与策略

## 核心性能指标

### 1. 加载性能指标

加载性能直接影响用户的首次体验，以下是关键指标：

- **First Contentful Paint (FCP)**

  ```js
  // 使用 Performance API 测量 FCP
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('FCP:', entry.startTime)
    }
  }).observe({ entryTypes: ['paint'] })
  ```

- **Largest Contentful Paint (LCP)**

  - 衡量最大内容元素的渲染时间
  - 优化目标：75% 的页面加载在 2.5 秒内完成 LCP

- **Time to Interactive (TTI)**
  - 页面可交互时间
  - 关注主线程空闲时间和长任务执行情况

### 2. 运行时性能指标

- **First Input Delay (FID)**

  ```js
  // 监测首次输入延迟
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const delay = entry.processingStart - entry.startTime
      console.log('FID:', delay)
    }
  }).observe({ entryTypes: ['first-input'] })
  ```

- **Cumulative Layout Shift (CLS)**
  - 衡量视觉稳定性
  - 优化目标：75% 的页面 CLS 小于 0.1

## 优化策略

### 1. 资源加载优化

```js
// 资源预加载示例
document.head.appendChild(
  Object.assign(document.createElement('link'), {
    rel: 'preload',
    href: '/assets/critical.js',
    as: 'script'
  })
)
```

#### 关键渲染路径优化

- 内联关键 CSS
- 异步加载非关键资源
- 合理使用资源提示（preload/prefetch）

#### 图片优化

```html
<!-- 响应式图片加载 -->
<picture>
  <source media="(min-width: 800px)" srcset="/images/hero-large.webp" type="image/webp" />
  <img src="/images/hero-small.jpg" loading="lazy" alt="Hero image" />
</picture>
```

### 2. 代码优化

#### JavaScript 优化

```js
// 代码分割示例
const AdminDashboard = React.lazy(() => import('./AdminDashboard'))

// 使用 Web Workers 处理密集计算
const worker = new Worker('/worker.js')
worker.postMessage({ data: complexData })
```

#### CSS 优化

```css
/* 关键 CSS 内联 */
<style>
  .hero {
    content-visibility: auto;
    contain-intrinsic-size: 300px;
  }
</style>
```

### 3. 缓存策略

#### 浏览器缓存

```nginx
# Nginx 缓存配置
location /static/ {
    expires 1y;
    add_header Cache-Control "public, no-transform";
}
```

#### Service Worker 缓存

```js
// Service Worker 缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)))
})
```

## 性能优化最佳实践

### 1. 构建优化

```js
// webpack 优化配置
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\]node_modules[\\]/,
          priority: -10
        }
      }
    },
    runtimeChunk: 'single'
  }
}
```

### 2. 运行时优化

#### 虚拟列表

```js
// 虚拟列表实现示例
class VirtualList {
  constructor(options) {
    this.itemHeight = options.itemHeight
    this.container = options.container
    this.items = options.items
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight)
  }

  render(scrollTop) {
    const startIndex = Math.floor(scrollTop / this.itemHeight)
    const endIndex = startIndex + this.visibleItems

    return this.items.slice(startIndex, endIndex).map((item) => this.renderItem(item))
  }
}
```

#### 防抖与节流

```js
// 实用的性能优化工具函数
const debounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const throttle = (fn, delay) => {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= delay) {
      fn(...args)
      last = now
    }
  }
}
```

## 总结

:::tip
前端性能优化是一个持续的过程，需要从多个维度进行：

1. 建立合适的性能指标监控体系
2. 制定针对性的优化策略
3. 在开发过程中遵循性能优化最佳实践
4. 持续监控和优化性能指标

通过合理运用上述优化策略和技术，我们可以显著提升应用的性能表现，为用户提供更好的体验。
:::
