---
hot: 6
sticky: 6
title: 前端性能监控与分析
date: 2024-05-11
isTimeLine: true
tags:
  - javascript
  - 性能优化
---

# 前端性能监控与分析

## 性能监控体系

### 1. 性能指标采集

#### 核心指标采集

```js
// 性能指标采集工具类
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.initObservers()
  }

  initObservers() {
    // FCP 观察者
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      this.metrics.fcp = entries[0].startTime
    }).observe({ entryTypes: ['paint'] })

    // LCP 观察者
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      this.metrics.lcp = entries[entries.length - 1].startTime
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // FID 观察者
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      this.metrics.fid = entries[0].processingStart - entries[0].startTime
    }).observe({ entryTypes: ['first-input'] })
  }

  getMetrics() {
    return this.metrics
  }
}
```

#### 自定义性能标记

```js
// 自定义性能标记示例
const marks = {
  start: 'custom-task-start',
  end: 'custom-task-end'
}

performance.mark(marks.start)
// 执行任务
performance.mark(marks.end)

performance.measure('custom-task', marks.start, marks.end)
```

### 2. 错误监控

#### 全局错误捕获

```js
// 错误监控配置
class ErrorMonitor {
  constructor() {
    this.init()
  }

  init() {
    // JS 错误监控
    window.addEventListener(
      'error',
      (event) => {
        this.reportError({
          type: 'js',
          error: {
            message: event.message,
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        })
      },
      true
    )

    // Promise 错误监控
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'promise',
        error: {
          message: event.reason?.message || event.reason,
          stack: event.reason?.stack
        }
      })
    })
  }

  reportError(error) {
    // 上报错误信息
    console.log('Error reported:', error)
  }
}
```

### 3. 资源监控

#### 资源加载性能

```js
// 资源加载性能监控
const getResourceTiming = () => {
  const resources = performance.getEntriesByType('resource')
  return resources.map((resource) => ({
    name: resource.name,
    type: resource.initiatorType,
    duration: resource.duration,
    size: resource.transferSize,
    protocol: resource.nextHopProtocol
  }))
}
```

## 性能数据分析

### 1. 数据聚合分析

```js
// 性能数据聚合工具
class PerformanceAnalyzer {
  constructor(data) {
    this.data = data
  }

  // 计算指标的统计值
  calculateStats(metric) {
    const values = this.data.map((item) => item[metric])
    return {
      avg: this.average(values),
      p75: this.percentile(values, 75),
      p90: this.percentile(values, 90),
      p95: this.percentile(values, 95)
    }
  }

  // 计算平均值
  average(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length
  }

  // 计算百分位数
  percentile(arr, p) {
    const sorted = [...arr].sort((a, b) => a - b)
    const pos = ((sorted.length - 1) * p) / 100
    const base = Math.floor(pos)
    const rest = pos - base
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  }
}
```

### 2. 性能瓶颈分析

#### 长任务分析

```js
// 长任务监控
const observeLongTasks = () => {
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry) => {
      if (entry.duration > 50) {
        // 超过50ms的任务
        console.log('Long Task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
          name: entry.name
        })
      }
    })
  }).observe({ entryTypes: ['longtask'] })
}
```

#### 内存泄漏分析

```js
// 内存使用监控
class MemoryMonitor {
  constructor() {
    this.records = []
  }

  start() {
    this.timer = setInterval(() => {
      const memory = performance.memory
      this.records.push({
        timestamp: Date.now(),
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize
      })
    }, 1000)
  }

  stop() {
    clearInterval(this.timer)
    return this.analyze()
  }

  analyze() {
    // 分析内存使用趋势
    return this.records.map((record, index) => {
      if (index === 0) return record
      const prev = this.records[index - 1]
      return {
        ...record,
        growth: record.usedJSHeapSize - prev.usedJSHeapSize
      }
    })
  }
}
```

## 持续优化方案

### 1. 性能预算

```js
// 性能预算检查工具
class PerformanceBudget {
  constructor(budgets) {
    this.budgets = budgets
  }

  check(metrics) {
    const violations = []

    Object.entries(this.budgets).forEach(([metric, budget]) => {
      if (metrics[metric] > budget) {
        violations.push({
          metric,
          budget,
          actual: metrics[metric],
          overage: metrics[metric] - budget
        })
      }
    })

    return violations
  }
}

// 使用示例
const budget = new PerformanceBudget({
  FCP: 1000, // 1s
  LCP: 2500, // 2.5s
  TTI: 3000 // 3s
})
```

### 2. 自动化性能测试

```js
// Lighthouse CI 配置示例
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: ['http://localhost:3000']
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-meaningful-paint': ['warn', { maxNumericValue: 2000 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
```

## 总结

:::tip
建立完善的前端性能监控体系对于保持应用的高性能至关重要：

1. 通过多维度的性能指标采集，全面了解应用性能状况
2. 建立自动化的性能分析流程，及时发现性能问题
3. 设定合理的性能预算，预防性能劣化
4. 实施持续的性能优化，保持应用的最佳状态

通过这些措施，我们可以构建一个可持续优化的性能保障体系，不断提升用户体验。
:::
