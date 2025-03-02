---
hidden: true
title: js 执行环境
date: 2023-03-01
isTimeLine: true
tags:
  - 小记
  - javascript
---

# js 执行环境

JS 是脚本语言，脚本语言都需要一个解析器才能运行。对于写在 HTML 页面里的 JS，浏览器充当了解析器的角色。而对于需要独立运行的 JS，NodeJS 就是一个解析器。
每一种解析器都是一个运行环境，不但允许 JS 定义各种数据结构，进行各种计算，还允许 JS 使用运行环境提供的内置对象和方法做一些事情。例如运行在浏览器中的 JS 的用途是操作 DOM，浏览器就提供了 document 之类的内置对象。而运行在 NodeJS 中的 JS 的用途是操作磁盘文件或搭建 HTTP 服务器，NodeJS 就相应提供了 fs、http 等内置对象。

因为运行环境不同，所以 nodejs 环境下并没有浏览器环境下的 DOM 和 BOM 模块，甚至 ECMAScript 模块的功能也是有一些差异的。
