---
top: 3
sticky: 998
title: 生成器
description: 对比 JavaScript 和 Python 的生成器
date: 2024-02-26
isTimeLine: true
tags:
  - javascript
---

# 生成器

## Python 生成器

- 定义
  在 Python 中，生成器函数使用 `def` 关键字定义，并且包含一个或多个 `yield` 表达式。生成器函数返回一个生成器对象，该对象可以用来逐个生成值。

- 语法

```python
def my_generator():
    yield 1
    yield 2
    yield 3
```

- 使用
  生成器对象可以通过调用 `next()` 函数或使用 `for` 循环来遍历。

```python
gen = my_generator()
print(next(gen))  # 1
print(next(gen))  # 2
print(next(gen))  # 3

# 使用 for 循环
for value in my_generator():
    print(value)  # 1, 2, 3
```

## JavaScript 生成器

- 定义
  在 JavaScript 中，生成器函数使用 `function*` 语法定义，并且包含一个或多个 `yield` 表达式。生成器函数返回一个生成器对象，该对象可以用来逐个生成值。

- 语法

```javascript
function* myGenerator() {
  yield 1
  yield 2
  yield 3
}
```

- 使用
  生成器对象可以通过调用 `next()` 方法或使用 `for...of` 循环来遍历。

```javascript
const gen = myGenerator()
console.log(gen.next()) // { value: 1, done: false }
console.log(gen.next()) // { value: 2, done: false }
console.log(gen.next()) // { value: 3, done: false }
console.log(gen.next()) // { value: undefined, done: true }

// 使用 for...of 循环
for (let value of myGenerator()) {
  console.log(value) // 1, 2, 3
}
```

## 相似之处

1. **生成器函数**：
   - Python 和 JavaScript 都使用生成器函数来创建生成器对象。
   - 生成器函数通过 `yield` 关键字来暂停和恢复执行。
2. **生成器对象**：
   - 生成器对象都是可迭代的，可以使用 `next()` 方法或循环来遍历。
3. **懒惰求值**：
   - 生成器都是懒惰求值的，即只有在需要时才会生成下一个值，这使得生成器非常适用于处理大量数据或无限序列。

## 不同之处

1. **语法**：
   - Python 使用 `def` 关键字定义生成器函数，并在函数体内使用 `yield`。
   - JavaScript 使用 `function*` 关键字定义生成器函数，并在函数体内使用 `yield`。
2. **返回值**：
   - Python 的 `next()` 函数返回生成的值。
   - JavaScript 的 `next()` 方法返回一个对象，该对象包含 `value` 和 `done` 属性。
3. **发送值**：
   - Python 生成器可以通过 `send()` 方法向生成器发送值，这在某些情况下非常有用。
   - JavaScript 生成器也可以通过 `next()` 方法的参数向生成器发送值。

## 示例：

- Python

```python
def my_generator():
    value = yield 1
    print(f"Received: {value}")
    yield 2

gen = my_generator()
print(next(gen))  # 1
print(gen.send(10))  # Received: 10, 2
```

- JavaScript

```javascript
function* myGenerator() {
  let value = yield 1
  console.log(`Received: ${value}`)
  yield 2
}

const gen = myGenerator()
console.log(gen.next()) // { value: 1, done: false }
console.log(gen.next(10)) // Received: 10, { value: 2, done: false }
```

## 总结

Python 和 JavaScript 的生成器在概念和使用上非常相似，都是用于生成迭代器对象的特殊函数。它们通过 `yield` 关键字来暂停和恢复执行，支持懒惰求值，并且可以用于处理大量数据或无限序列。主要的不同之处在于语法和返回值的格式。希望这能帮助您更好地理解 Python 和 JavaScript 生成器的相似性和不同之处！如果有更多问题，请随时提问。
