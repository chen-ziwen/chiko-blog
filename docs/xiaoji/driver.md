---
title: 驱动收集
date: 2024-05-20
isTimeLine: true
tags:
  - 设计模式
  - nginx
---

# 驱动收集

通过学习 nginx 源码学到的一种设计模式，把一系列模块通过 Driver 类去收集起来：

```ts
import { Config, IConfig, IConfigHandler } from '..'

type Map<T> = { [key: string]: { new (name: string, handler: IConfigHandler, entry: Config): T } }

export class Driver {
  protected static mDriver: Map<IConfig> = {}
  protected static mHandler: IConfigHandler
  private static mInjectHandler: (config: IConfig) => void
  public static bind(handler: IConfigHandler) {
    this.mHandler = handler
  }

  public static inject(handler: (config: IConfig) => void) {
    this.mInjectHandler = handler
  }

  public static use(name: string, cls: { new (name: string, handler: IConfigHandler): IConfig }) {
    if (this.has(name)) {
      console.error(`\x1b[41mWARNGIN\x1b[0m \x1b[31m \`${name}\` register to config duplication!!!\x1b[0m`)
    } else {
      this.mDriver[name] = cls
    }
  }

  public static has(name: string) {
    return this.mDriver[name] != null
  }

  public static create(name: string, entry: Config, handler?: IConfigHandler) {
    if (this.mDriver[name]) {
      let cls = new this.mDriver[name](name, handler || this.mHandler, entry)
      if (this.mInjectHandler) {
        this.mInjectHandler(cls)
      }
      return cls
    }

    console.error(`\x1b[41mWARNGIN\x1b[0m \x1b[31m \`${name}\` not register!!!\x1b[0m`)

    return {}
  }
}
```

收集的模块：

```ts
Driver.use('raffle', RaffleConfig)
Driver.use('gift-timeout', GiftTimeoutConfig)
Driver.use('keyevent-next', KeyeventNextConfig)
```

使用模块：
因为模块已经收集完毕，这个时候就可以统一去使用，非常的方便快捷！

```ts
if (Driver.has(prop)) {
  this.mConfigs[prop] = <IConfig>Driver.create(prop, this)
  return this.mConfigs[prop]
}
```
