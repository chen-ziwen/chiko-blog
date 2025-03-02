---
top: 5
sticky: 997
title: 像素、分辨率与移动端适配
date: 2024-01-10
isTimeLine: true
tags:
  - 操作系统
  - 前端开发
  - 移动端适配
description: 物理像素、逻辑像素、设备像素比等概念，以及在移动端开发中的实际应用
---

# 像素、分辨率与移动端适配

## 基本概念

### 物理像素（Physical Pixel）

物理像素是设备能控制显示的最小单位，也称为设备像素。当我们说一个显示器的分辨率是 1920×1080 时，就是指的物理像素数量。

- 特点：固定不变，由设备硬件决定
- 作用：实际显示的基本单位

### 逻辑像素（Logical Pixel）

逻辑像素也称为设备独立像素（Device Independent Pixel, DIP）或 CSS 像素。在 CSS 中使用的 px 单位就是逻辑像素。

- 特点：在不同设备上保持相对一致的显示效果
- 默认情况：1 物理像素 = 1 逻辑像素
- 高清屏：1 逻辑像素 = 多个物理像素

## 设备像素比（DPR）

### 定义与计算

设备像素比（Device Pixel Ratio）是物理像素与逻辑像素的比值：

```javascript
DPR = 物理像素 / 逻辑像素
```

### 实际应用

- 当 DPR = 2 时，1个CSS像素由 2×2 个物理像素显示
- 在 Retina 屏幕上，需要提供 2 倍大小的图片才能保持清晰度

```javascript
// 获取设备像素比
const dpr = window.devicePixelRatio
console.log(`当前设备的像素比为：${dpr}`)
```

## 分辨率与像素密度

### 屏幕分辨率

分辨率表示显示器所能显示的像素总数。例如：

- 1920×1080：表示水平方向有1920个像素点，垂直方向有1080个像素点
- 分辨率越高，在相同屏幕尺寸下图像越清晰

### 像素密度（PPI）

PPI（Pixel Per Inch）表示每英寸包含的像素点数：

- 低密度：120-160 PPI
- 中密度：160-240 PPI
- 高密度：240-320 PPI
- 超高密度：320+ PPI（如 Retina 显示屏）

## 移动端适配方案

### Viewport 设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

这行代码的作用是：

- 将视口宽度设置为设备宽度
- 将 CSS 像素与设备像素对应
- 确保移动端显示的正确性

### rem 适配方案

rem 是相对于根元素（html）的字体大小的单位：

```javascript
// 动态设置 rem 基准值
function setRem() {
  const designWidth = 750 // 设计稿宽度
  const clientWidth = document.documentElement.clientWidth
  const baseFontSize = 16 // 基准字体大小

  // 计算实际使用的字体大小
  const fontSize = (clientWidth / designWidth) * baseFontSize
  document.documentElement.style.fontSize = `${fontSize}px`
}

// 页面加载和窗口改变时重新计算
window.addEventListener('load', setRem)
window.addEventListener('resize', setRem)
```

### rpx 单位（小程序）

rpx 是微信小程序中的响应式单位：

- 规定屏幕宽度为 750rpx
- 转换公式：px = rpx \* (屏幕宽度 / 750)
- 示例：iPhone 6 屏幕宽度 375px，则 1rpx = 0.5px

## 实际应用示例

### 1. 获取设备信息

```javascript
// 获取设备的逻辑像素尺寸
const logicalWidth = document.documentElement.clientWidth
const logicalHeight = document.documentElement.clientHeight

// 获取设备像素比
const dpr = window.devicePixelRatio

// 计算物理像素尺寸
const physicalWidth = logicalWidth * dpr
const physicalHeight = logicalHeight * dpr
```

### 2. 高清图片适配

```javascript
function getHighResImage(url, dpr = window.devicePixelRatio) {
  // 根据设备像素比选择合适分辨率的图片
  const extension = url.split('.').pop()
  const baseUrl = url.slice(0, -(extension.length + 1))
  return `${baseUrl}@${dpr}x.${extension}`
}

// 使用示例
const imageUrl = 'example.png'
const highResUrl = getHighResImage(imageUrl) // 返回 example@2x.png 或 example@3x.png
```

## 总结

:::tip
在移动端开发中，理解物理像素、逻辑像素和设备像素比的概念至关重要：

1. 逻辑像素（CSS像素）是我们在开发中使用的单位
2. 物理像素是设备实际显示的单位
3. 设备像素比（DPR）连接了逻辑像素和物理像素
4. 合理使用 rem 或 rpx 可以实现更好的移动端适配

通过正确运用这些概念，我们可以开发出在各种设备上都能良好展示的响应式页面。
:::
