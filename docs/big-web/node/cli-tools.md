---
title: CLI 工具的多种使用方式
description: 简单总结 CLI 工具最常用的三种方式
isTimeLine: true
date: 2025-6-13
tags:
  - NPM
  - CLI
---

# CLI 工具的多种使用方式

## 使用方式

> CLI 工具的三种使用方式，这边进行一个简单的总结，以 git-cz 这个工具为例。

使用 pnpm 指令执行脚本时，可以省略 run， 例如 npm 运行 dev 指令，需要执行 `npm run dev` ，而 pnpm 只需要执行 `pnpm dev` 即可。

### 全局

安装：`pnpm add git-cz -g` 通过全局下载的包，可以在任意的项目中使用。

使用： 任意终端执行 `git-cz`。

### 作为开发依赖

安装：`pnpm add git-cz --save-dev` 该方法会下载到项目的开发依赖中，这个时候想要使用需要在 `package.json` 配置一下脚本，代码如下：

```json
{
  "script": {
    "cz": "git-cz"
  }
}
```

使用：安装该依赖的项目执行 `pnpm cz`。

### 利用 npx 直接执行（无需安装）

使用： 任意终端执行 `npx git-cz`，需要 npm 版本在 5.2.0 及以上才可使用。
