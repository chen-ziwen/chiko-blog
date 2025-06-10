---
hidden: true
title: 设置 Nodejs 项目的包导入方式
date: 2025-06-10
isTimeLine: true
tags:
  - ESModule
  - CommonJS
  - 复习
---

# 设置 Nodejs 项目的包导入方式

Nodejs 一般有两种包导入方式:

- ESModule
- CommonJS

### 整体项目

- 当 `package.json` 的 `type` 字段为 `module` 时，所有文件都使用 `esmodule` 导入方式。
- 当 `package.json` 的 `type` 字段为 `commonjs` 或不设置时，所有文件都使用 `commonjs` 导入方式。

### 单个文件

- 当项目整体为 `esmodule` 时，单个文件想使用 `commonjs` 导入方式时，将该文件的后缀改为 `.cjs` 即可。
- 当项目整体为 `commonjs` 时，单个文件想使用 `esmodule` 导入方式时，将文件后缀改为 `.mjs` 即可。
