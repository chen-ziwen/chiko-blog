---
title: 理解 Node.js 多进程架构
description: 详细解析 Node.js 的进程管理、集群模式和进程间通信机制
isTimeLine: true
date: 2023-10-15
tags:
  - Node
  - 多进程
  - 性能优化
---

# 理解 Node.js 多进程架构

## 进程基础概念

Node.js 是单线程的，但通过多进程架构可以充分利用多核 CPU，提高应用性能和可靠性。

## 进程管理

### 1. 创建子进程

```javascript
const { spawn, exec, execFile, fork } = require('child_process')

// 使用 spawn 创建子进程
const ls = spawn('ls', ['-lh', '/usr'])

ls.stdout.on('data', (data) => {
  console.log(`输出：${data}`)
})

ls.stderr.on('data', (data) => {
  console.error(`错误：${data}`)
})

ls.on('close', (code) => {
  console.log(`子进程退出码：${code}`)
})
```

### 2. 进程间通信（IPC）

```javascript
// parent.js
const { fork } = require('child_process')

const child = fork('child.js')

// 向子进程发送消息
child.send({ hello: 'world' })

// 接收子进程消息
child.on('message', (message) => {
  console.log('来自子进程的消息：', message)
})

// child.js
process.on('message', (message) => {
  console.log('来自父进程的消息：', message)
  // 回复父进程
  process.send({ received: true })
})
```

## 集群模式

### 1. 基本集群设置

```javascript
const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`)

  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`)
    // 重启工作进程
    cluster.fork()
  })
} else {
  // 工作进程可以共享任何 TCP 连接
  http
    .createServer((req, res) => {
      res.writeHead(200)
      res.end('你好，世界\n')
    })
    .listen(8000)

  console.log(`工作进程 ${process.pid} 已启动`)
}
```

### 2. 负载均衡

```javascript
const cluster = require('cluster')

if (cluster.isMaster) {
  // 自定义调度策略
  cluster.schedulingPolicy = cluster.SCHED_RR // 轮询

  // 创建工作进程
  const workers = []
  for (let i = 0; i < numCPUs; i++) {
    workers.push(cluster.fork())
  }

  // 监控工作进程负载
  workers.forEach((worker) => {
    worker.on('message', (msg) => {
      if (msg.cmd === 'WORKER_LOAD') {
        // 处理工作进程负载信息
        handleWorkerLoad(worker.id, msg.load)
      }
    })
  })
}
```

## 进程守护

### 1. 错误处理

```javascript
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常：', err)
  // 记录错误并优雅退出
  gracefulShutdown()
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝：', reason)
  // 记录错误
  logError(reason)
})

function gracefulShutdown() {
  // 停止接受新请求
  server.close(() => {
    // 清理资源
    cleanup()
      .then(() => {
        process.exit(1)
      })
      .catch((err) => {
        console.error('清理失败：', err)
        process.exit(1)
      })
  })

  // 如果清理超时，强制退出
  setTimeout(() => {
    console.error('强制退出')
    process.exit(1)
  }, 30000)
}
```

### 2. 进程监控

```javascript
const os = require('os')

function monitorProcess() {
  const usage = process.memoryUsage()
  const cpuUsage = process.cpuUsage()

  const metrics = {
    memory: {
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      rss: usage.rss
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    uptime: process.uptime(),
    pid: process.pid
  }

  // 发送指标到监控系统
  sendMetrics(metrics)
}

// 定期收集指标
setInterval(monitorProcess, 60000)
```

## 性能优化

### 1. 内存优化

```javascript
const v8 = require('v8')

function optimizeMemory() {
  // 设置 V8 内存限制
  const heapSizeLimit = 1024 * 1024 * 1024 // 1GB
  v8.setFlagsFromString(`--max-old-space-size=${heapSizeLimit}`)

  // 监控内存使用
  setInterval(() => {
    const usage = process.memoryUsage()
    const percentage = (usage.heapUsed / usage.heapTotal) * 100

    if (percentage > 90) {
      // 触发垃圾回收
      global.gc && global.gc()
    }
  }, 30000)
}
```

### 2. CPU 密集型任务处理

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads')

if (isMainThread) {
  // 主线程
  const worker = new Worker(__filename)

  worker.on('message', (result) => {
    console.log('计算结果：', result)
  })

  worker.postMessage({ data: complexData })
} else {
  // 工作线程
  parentPort.on('message', (message) => {
    const result = performHeavyComputation(message.data)
    parentPort.postMessage(result)
  })
}

function performHeavyComputation(data) {
  // CPU 密集型计算
  return result
}
```

## 最佳实践

1. **优雅退出**

```javascript
function gracefulExit() {
  console.log('开始优雅退出...')

  // 停止接受新连接
  server.close(() => {
    console.log('已停止接受新连接')

    // 等待现有连接完成
    setTimeout(() => {
      console.log('正在关闭数据库连接...')
      // 关闭数据库连接
      closeDatabase()
        .then(() => {
          console.log('数据库连接已关闭')
          process.exit(0)
        })
        .catch((err) => {
          console.error('关闭数据库时出错：', err)
          process.exit(1)
        })
    }, 10000)
  })
}

// 监听退出信号
process.on('SIGTERM', gracefulExit)
process.on('SIGINT', gracefulExit)
```

2. **进程通信最佳实践**

```javascript
class ProcessManager {
  constructor() {
    this.workers = new Map()
    this.messageQueue = []
  }

  broadcast(message) {
    for (const [pid, worker] of this.workers) {
      try {
        worker.send(message)
      } catch (err) {
        console.error(`向进程 ${pid} 发送消息失败：`, err)
        this.handleWorkerError(pid)
      }
    }
  }

  handleWorkerError(pid) {
    const worker = this.workers.get(pid)
    if (worker) {
      worker.kill()
      this.workers.delete(pid)
      // 创建新的工作进程
      this.createWorker()
    }
  }
}
```

## 总结

:::tip
Node.js 的多进程架构是构建高性能、可靠应用的关键：

- 充分利用多核 CPU
- 提高应用可用性
- 实现负载均衡
- 保证系统稳定性

在实际开发中，应该根据应用特点选择合适的进程模型，并注意：

- 合理分配进程资源
- 实现可靠的进程间通信
- 做好错误处理和进程守护
- 优化性能和资源使用
  :::
