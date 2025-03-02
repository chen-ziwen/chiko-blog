---
hidden: true
title: uniapp 使用 unocss
date: 2024-11-02
isTimeLine: true
tags:
  - uniapp
  - unocss
---

# uniapp 使用 unocss

默认情况下，UnoCSS 会自动在项目的根目录中查找 uno.config.{js,ts,mjs,mts} 或 unocss.config.{js,ts,mjs,mts}。你也可以手动指定配置文件，例如在 Vite 中：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    UnoCSS({
      configFile: '../my-uno.config.ts'
    })
  ]
})
```

Unocss 很好用，而 Uniapp 所用到的 Unocss-preset-weapp 就是 Unocss 的一套预设规则。而基于强大的 Unocss，我也完全可以自己去实现一套 Unocss 规则
