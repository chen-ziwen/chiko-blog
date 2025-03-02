---
hidden: true
title: Vue3组件通信方式
date: 2024-03-20
isTimeLine: true
tags:
  - Vue3
  - 组件通信
---

# Vue3组件通信方式

在Vue3中，组件之间的通信方式有多种，以下是常见的几种：

## 1. Props和Emit

最基础的父子组件通信方式：

```vue
<!-- 父组件 -->
<template>
  <child-component :message="msg" @update="handleUpdate" />
</template>

<!-- 子组件 -->
<template>
  <div @click="emit('update', 'new value')">
    {{ message }}
  </div>
</template>
```

## 2. Provide/Inject

适用于深层组件嵌套的场景：

```ts
// 父组件
const message = ref('Hello')
provide('message', message)

// 子组件
const message = inject('message')
```

## 3. Vuex/Pinia

全局状态管理：

```ts
// Pinia store
export const useUserStore = defineStore('user', {
  state: () => ({
    name: ''
  }),
  actions: {
    updateName(name: string) {
      this.name = name
    }
  }
})
```

## 4. EventBus

使用mitt实现的事件总线：

```ts
import mitt from 'mitt'

const emitter = mitt()

// 组件A发送事件
emitter.emit('update', { data: 'new value' })

// 组件B监听事件
emitter.on('update', (data) => {
  console.log(data)
})
```

## 5. v-model

双向绑定：

```vue
<!-- 父组件 -->
<template>
  <custom-input v-model="searchText" />
</template>

<!-- 子组件 CustomInput.vue -->
<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>
```

:::tip
选择合适的通信方式要考虑组件之间的关系和数据流向。一般来说：

- 父子组件用props/emit
- 跨层级组件用provide/inject
- 全局状态用Pinia
- 独立组件间通信用EventBus
  :::
