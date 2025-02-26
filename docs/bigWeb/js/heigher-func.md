---
title: 功能强大的高阶函数
description: 高阶函数非常的强大，能解决很多问题，不会的小伙伴要学习起来！
date: 2025-02-26
isTimeLine: true
tags:
  - javascript
  - 大前端
---

# 功能强大的高阶函数

其实我们在日常的开发中，经常会用到高阶函数，例如：`map`，`filter`，`reduce`等等。它们的强大相信大家都毋庸置疑，但大家是否自己写过高阶函数呢？如果没有的话，可以尝试写一写。

## 高阶函数的定义

高阶函数是 JavaScript 中一种重要的编程概念，它指的是可以接受一个或多个函数作为参数，或者返回一个函数的特殊函数。这种特性使得高阶函数在代码复用、抽象化以及函数组合方面表现出色，同时提升了代码的灵活性和可维护性。

### 高阶函数的核心特点

接收函数作为参数：例如`Array.prototype.map`方法，通过传递一个回调函数来处理数组中的每个元素，并生成新的数组。

```js
const numbers = [1, 2, 3]
const doubled = numbers.map((num) => num * 2)
console.log(doubled) // 输出: [2, 4, 6]
```

返回函数作为结果：如创建加法器的例子，通过闭包实现动态函数的生成。

```js
function createAdder(x) {
  return function (y) {
    return x + y
  }
}
const add5 = createAdder(5)
console.log(add5(3)) // 输出: 8
```

## 工作中实现案例

例如下面这个`upsert`函数，主要用来插入和更新用户信息。通过传递函数进去接收旧对象，返回新对象的操作，让调用这个函数时不用去纠结用户是否已经存在，只需要将参数传递即可，大大提高了函数的可复用性。

```js 主函数
upsert(user: PlayerItem, callback: (oUser: PlayerItem) => PlayerItem) {
    const { userId } = user;
    const isExist = this.mPlayerMap.has(userId);
    if (isExist) {
        const nUser = callback(this.mPlayerMap.get(userId)!);
        this.update(nUser);
    } else {
            this.insert(user);
    }
}
```

传入回调函数，当用户已经存在时触发，函数接收旧的用户信息，将旧信息中的`giftCount`（送礼次数）更新，更新完再返回给`upsert`函数内部进行后面的操作。

```js 外部调用
upsert(user, (oUser: PlayerItem) => {
    oUser.giftCount += user.giftCount;
    return oUser;
});
```
