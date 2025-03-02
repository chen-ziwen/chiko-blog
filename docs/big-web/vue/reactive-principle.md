---
title: Vue响应式原理分析
date: 2024-02-17
isTimeLine: true
tags:
  - Vue
  - 响应式系统
  - 原理分析
description: 深入解析Vue2和Vue3响应式系统的实现原理
---

# Vue响应式原理分析

## Vue2的响应式系统

### 1. Object.defineProperty

Vue2通过Object.defineProperty来实现数据的响应式，通过劫持对象的属性访问和修改操作来追踪依赖：

```javascript
// Vue2响应式系统的核心实现
function defineReactive(obj, key, val) {
  const dep = new Dep() // 依赖收集器

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend() // 收集依赖
      }
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      dep.notify() // 通知更新
    }
  })
}
```

### 2. 依赖收集与更新

```javascript
// 依赖收集器
class Dep {
  constructor() {
    this.subscribers = new Set()
  }

  depend() {
    if (Dep.target) {
      this.subscribers.add(Dep.target)
    }
  }

  notify() {
    this.subscribers.forEach((sub) => sub.update())
  }
}

// 观察者
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  get() {
    Dep.target = this
    const value = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return value
  }

  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
```

### 3. Vue2响应式系统的局限性

1. 无法检测对象属性的添加和删除
2. 无法直接监听数组的索引和长度变化
3. 需要递归遍历对象的所有属性

```javascript
// Vue2中处理数组响应式的特殊方法
const arrayMethods = Object.create(Array.prototype)
const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    const result = Array.prototype[method].apply(this, args)
    const ob = this.__ob__
    ob.dep.notify()
    return result
  }
})
```

## Vue3的响应式系统

### 1. Proxy的优势

Vue3使用Proxy来实现响应式系统，相比Vue2有以下优势：

1. 可以监听对象属性的添加和删除
2. 可以监听数组的索引和长度变化
3. 不需要递归遍历，性能更好

```javascript
// Vue3响应式系统的核心实现
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      track(target, key) // 依赖收集
      return result
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key) // 触发更新
      }
      return result
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const result = Reflect.deleteProperty(target, key)
      if (hadKey && result) {
        trigger(target, key) // 触发更新
      }
      return result
    }
  })
}
```

### 2. 依赖收集与触发更新

```javascript
// 依赖收集
let activeEffect
const targetMap = new WeakMap()

function track(target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(activeEffect)
}

// 触发更新
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach((effect) => effect())
  }
}

// 副作用函数
function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
    activeEffect = null
  }
  effectFn()
  return effectFn
}
```

### 3. Ref和Reactive

Vue3提供了两种创建响应式数据的方式：

```javascript
// ref：用于处理基本类型数据
function ref(value) {
  return {
    get value() {
      track(this, 'value')
      return value
    },
    set value(newValue) {
      if (value !== newValue) {
        value = newValue
        trigger(this, 'value')
      }
    }
  }
}

// reactive：用于处理对象类型数据
const state = reactive({
  count: 0,
  list: [1, 2, 3]
})

effect(() => {
  console.log(state.count) // 会自动收集依赖
})

state.count++ // 自动触发更新
```

## 总结

:::tip
Vue的响应式系统是其最核心的特性之一。Vue3通过Proxy的实现相比Vue2的Object.defineProperty有了质的提升，不仅解决了之前的限制，还带来了更好的性能和更简洁的代码。响应式原理，有助于我们更好地使用Vue进行开发。
:::
