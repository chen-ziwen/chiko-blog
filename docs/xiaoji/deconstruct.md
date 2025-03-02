---
hidden: true
title: js 解构赋值默认值
date: 2023-05-01
isTimeLine: true
tags:
  - javascript
---

# js 解构赋值默认值

js 的解构赋值可以别名也可以提供默认值，当解构出来的值不存在时（等于 undefined 时），使用默认值，如果存在时，就使用自身解构出来的值。

```ts
const { a: a1 = aDefault, b = bDefault } = obj
```

就比如下面的这个

```ts
export function useRefHistory<Raw, Serialized = Raw>(
  source: Ref<Raw>,
  options: UseRefHistoryOptions<Raw, Serialized> = {}
): UseRefHistoryReturn<Raw, Serialized> {
  const {
    deep = false, // 提供解构默认值
    flush = 'pre',
    eventFilter
  } = options
}
```

```ts
const {
  flush = 'pre',
  deep = true,
  listenToStorageChanges = true,
  writeDefaults = true,
  mergeDefaults = false,
  shallow,
  window = defaultWindow,
  eventFilter,
  onError = (e) => {
    console.error(e)
  },
  initOnMounted
} = options // 解构赋值提供初始值的方式很常用
```
