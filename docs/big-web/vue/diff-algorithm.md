---
top: 3
sticky: 999
title: Vue的Diff算法详解
date: 2024-11-22
isTimeLine: true
tags:
  - Vue
  - 虚拟DOM
  - Diff算法
description: 深入分析Vue中虚拟DOM的Diff算法实现原理
---

# Vue的Diff算法详解

## 什么是虚拟DOM

虚拟DOM（Virtual DOM）是对真实DOM的一种轻量级描述，它本质上是一个JavaScript对象。Vue通过虚拟DOM来追踪组件的状态变化并高效地更新真实DOM。

```javascript
// 虚拟DOM节点的基本结构
const vnode = {
  type: 'div',
  props: {
    id: 'app',
    class: 'container'
  },
  children: [
    {
      type: 'h1',
      props: null,
      children: 'Hello Vue'
    }
  ]
}
```

## Diff算法的核心原理

### 1. 同层比较策略

Vue的Diff算法采用同层比较的策略，只会比较同一层级的节点，而不会跨层级比较。这种策略大大降低了算法的时间复杂度。

```javascript
// 旧的虚拟DOM树
old = {
  type: 'div',
  children: [
    { type: 'p', children: 'text1' },
    { type: 'p', children: 'text2' }
  ]
}

// 新的虚拟DOM树
new = {
  type: 'div',
  children: [
    { type: 'p', children: 'text1' },
    { type: 'span', children: 'text2' } // 只比较同层的p和span
  ]
}
```

### 2. 双端比较算法

Vue2中采用双端比较算法，通过四个指针分别指向新旧子节点的首尾，进行两两比较，尽可能复用DOM节点。

```javascript
// 双端比较的四种情况
function patchChildren(oldCh, newCh) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newStartIdx = 0
  let newEndIdx = newCh.length - 1

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldCh[oldStartIdx], newCh[newStartIdx])) {
      // 1. 头头比较
      patchVnode(oldCh[oldStartIdx], newCh[newStartIdx])
      oldStartIdx++
      newStartIdx++
    } else if (sameVnode(oldCh[oldEndIdx], newCh[newEndIdx])) {
      // 2. 尾尾比较
      patchVnode(oldCh[oldEndIdx], newCh[newEndIdx])
      oldEndIdx--
      newEndIdx--
    } else if (sameVnode(oldCh[oldStartIdx], newCh[newEndIdx])) {
      // 3. 头尾比较
      patchVnode(oldCh[oldStartIdx], newCh[newEndIdx])
      // 将旧头节点移动到尾部
      oldStartIdx++
      newEndIdx--
    } else if (sameVnode(oldCh[oldEndIdx], newCh[newStartIdx])) {
      // 4. 尾头比较
      patchVnode(oldCh[oldEndIdx], newCh[newStartIdx])
      // 将旧尾节点移动到头部
      oldEndIdx--
      newStartIdx++
    }
  }
}
```

### 3. 快速Diff算法（Vue3）

Vue3采用了更快的Diff算法，主要包含以下步骤：

1. 预处理：处理新旧子节点序列的头尾节点
2. 最长递增子序列：通过最长递增子序列算法找出可复用的节点

```javascript
// Vue3的快速Diff算法示例
const quickDiff = (n1, n2) => {
  const oldChildren = n1.children
  const newChildren = n2.children

  // 1. 处理头部相同的节点
  let j = 0
  let oldVNode = oldChildren[j]
  let newVNode = newChildren[j]
  while (oldVNode && newVNode && oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode)
    j++
    oldVNode = oldChildren[j]
    newVNode = newChildren[j]
  }

  // 2. 处理尾部相同的节点
  let oldEnd = oldChildren.length - 1
  let newEnd = newChildren.length - 1
  oldVNode = oldChildren[oldEnd]
  newVNode = newChildren[newEnd]
  while (oldVNode && newVNode && oldVNode.key === newVNode.key) {
    patch(oldVNode, newVNode)
    oldEnd--
    newEnd--
    oldVNode = oldChildren[oldEnd]
    newVNode = newChildren[newEnd]
  }

  // 3. 处理剩余节点
  if (j > oldEnd && j <= newEnd) {
    // 添加新节点
    const anchorIndex = newEnd + 1
    const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
    while (j <= newEnd) {
      patch(null, newChildren[j++], anchor)
    }
  } else if (j > newEnd && j <= oldEnd) {
    // 删除多余节点
    while (j <= oldEnd) {
      unmount(oldChildren[j++])
    }
  }
}
```

## Diff算法的优化策略

### 1. key的作用

在列表渲染中使用key可以帮助Vue更准确地判断节点是否可以复用：

```javascript
// 使用key的列表渲染
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </ul>
</template>
```

### 2. 静态节点优化

Vue3中引入了静态节点提升，将不会变化的节点标记为静态节点，在diff过程中直接跳过：

```javascript
// 静态节点提升示例
const _hoisted_1 = /*#__PURE__*/ createStaticVNode('<div class="static">Static Content</div>')

export default {
  render() {
    return _hoisted_1
  }
}
```

### 3. 块级树结构（Block Tree）

Vue3引入了块级树的概念，只有动态节点才会被追踪，进一步提升了diff效率：

```javascript
// 块级树示例
const Comp = {
  render() {
    return (
      openBlock(),
      createBlock('div', null, [
        createVNode('p', null, text.value), // 动态节点
        createVNode('div', null, 'static') // 静态节点
      ])
    )
  }
}
```

## 总结

:::tip
Vue的Diff算法通过巧妙的设计和优化策略，实现了虚拟DOM的高效更新。从Vue2的双端比较到Vue3的快速Diff算法，不断地在提升性能和优化用户体验。理解Diff算法的原理，有助于我们更好地优化Vue应用的性能。
:::
