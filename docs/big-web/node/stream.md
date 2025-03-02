---
title: 理解 Node.js 流机制
description: 详细解析 Node.js 的流式处理机制、各类流的使用方法和最佳实践
isTimeLine: true
date: 2023-03-12
tags:
  - Node.js
  - Stream
  - 性能优化
---

# 理解 Node.js 流机制

## 流的基本概念

流（Stream）是 Node.js 中处理流式数据的抽象接口，它可以让我们以高效的方式处理读写文件、网络通信等 I/O 操作。

## 流的类型

### 1. 可读流（Readable Stream）

```javascript
const fs = require('fs')

// 创建可读流
const readStream = fs.createReadStream('large-file.txt', {
  highWaterMark: 64 * 1024, // 64KB 的缓冲区
  encoding: 'utf8'
})

// 处理数据块
readStream.on('data', (chunk) => {
  console.log('接收到数据块：', chunk.length, '字节')
})

// 处理流结束
readStream.on('end', () => {
  console.log('数据读取完成')
})

// 错误处理
readStream.on('error', (error) => {
  console.error('读取错误：', error)
})
```

### 2. 可写流（Writable Stream）

```javascript
const fs = require('fs')

// 创建可写流
const writeStream = fs.createWriteStream('output.txt', {
  flags: 'w',
  encoding: 'utf8'
})

// 写入数据
writeStream.write('Hello, ')
writeStream.write('World!')

// 结束写入
writeStream.end(() => {
  console.log('写入完成')
})

// 错误处理
writeStream.on('error', (error) => {
  console.error('写入错误：', error)
})
```

### 3. 双工流（Duplex Stream）

```javascript
const { Duplex } = require('stream')

class MyDuplex extends Duplex {
  constructor(options) {
    super(options)
    this.data = ['Hello', 'World', 'Stream']
  }

  _read(size) {
    const data = this.data.shift()
    if (data) {
      this.push(data)
    } else {
      this.push(null)
    }
  }

  _write(chunk, encoding, callback) {
    console.log('写入数据：', chunk.toString())
    callback()
  }
}

const duplex = new MyDuplex()

duplex.on('data', (chunk) => {
  console.log('读取数据：', chunk.toString())
})

duplex.write('测试数据')
```

## 流的应用场景

### 1. 文件压缩

```javascript
const fs = require('fs')
const zlib = require('zlib')

// 使用管道链接多个流
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'))
  .on('finish', () => {
    console.log('文件压缩完成')
  })
```

### 2. HTTP 流式响应

```javascript
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  // 流式处理大文件
  if (req.url === '/video') {
    const videoStream = fs.createReadStream('large-video.mp4')
    res.writeHead(200, {
      'Content-Type': 'video/mp4'
    })
    videoStream.pipe(res)
  }
})

server.listen(3000)
```

## 性能优化

### 1. 内存管理

```javascript
const fs = require('fs')
const { Transform } = require('stream')

// 创建转换流进行数据处理
const processChunk = new Transform({
  transform(chunk, encoding, callback) {
    // 处理数据块，避免一次性加载大量数据到内存
    const processed = someHeavyProcessing(chunk)
    this.push(processed)
    callback()
  }
})

// 流式处理大文件
fs.createReadStream('large-file.txt').pipe(processChunk).pipe(fs.createWriteStream('output.txt'))

function someHeavyProcessing(data) {
  // 实际的数据处理逻辑
  return data
}
```

### 2. 背压处理

```javascript
const fs = require('fs')

const readStream = fs.createReadStream('source.txt')
const writeStream = fs.createWriteStream('destination.txt')

// 手动控制数据流动
readStream.on('data', (chunk) => {
  // 检查写入流是否已满
  const canContinue = writeStream.write(chunk)

  if (!canContinue) {
    // 暂停读取
    readStream.pause()

    // 等待 drain 事件后继续
    writeStream.once('drain', () => {
      readStream.resume()
    })
  }
})
```

## 最佳实践

1. **错误处理**

```javascript
function handleStream(stream) {
  return new Promise((resolve, reject) => {
    // 始终处理错误事件
    stream.on('error', reject)

    // 根据流的类型处理完成事件
    if (stream.readable) {
      stream.on('end', resolve)
    } else if (stream.writable) {
      stream.on('finish', resolve)
    }
  })
}

// 使用 async/await 处理流
async function processStream() {
  const readStream = fs.createReadStream('input.txt')
  const writeStream = fs.createWriteStream('output.txt')

  try {
    await Promise.all([handleStream(readStream), handleStream(writeStream)])
    console.log('流处理完成')
  } catch (error) {
    console.error('流处理错误：', error)
  }
}
```

2. **资源清理**

```javascript
const cleanup = (stream) => {
  return new Promise((resolve) => {
    stream.on('close', () => {
      resolve()
    })
    stream.destroy()
  })
}

async function safelyProcessStream() {
  const stream = fs.createReadStream('file.txt')

  try {
    await processStreamData(stream)
  } finally {
    await cleanup(stream)
  }
}
```

## 总结

::: tip
Node.js 的流机制是一个强大的功能，它可以帮助我们：

- 高效处理大文件
- 优化内存使用
- 提供更好的数据处理方式
- 实现复杂的数据管道

在实际开发中，合理使用流可以显著提升应用性能和用户体验。记住要始终：

- 正确处理错误
- 实现背压机制
- 及时清理资源
- 选择合适的缓冲区大小
  :::
