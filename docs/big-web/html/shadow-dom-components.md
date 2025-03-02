---
title: Shadow DOM和Web Components
date: 2024-01-15
isTimeLine: true
tags:
  - HTML
  - Web Components
  - Shadow DOM
description: 深入探讨Shadow DOM和Web Components技术，掌握现代Web组件化开发
---

# Shadow DOM和Web Components

## Shadow DOM基础

### 什么是Shadow DOM？

Shadow DOM是Web Components的核心技术之一，它允许将隐藏的DOM树附加到常规的DOM树中。这个隐藏的DOM树具有以下特点：

- 独立的作用域
- 样式隔离
- 简化的CSS
- 清晰的组件边界

### 创建Shadow DOM

```javascript
// 创建一个自定义元素的容器
const host = document.createElement('div')

// 创建Shadow DOM
const shadow = host.attachShadow({ mode: 'open' })

// 添加内容到Shadow DOM
shadow.innerHTML = `
  <style>
    .card {
      padding: 10px;
      border: 1px solid #ccc;
    }
  </style>
  <div class="card">
    <h2>Shadow DOM Content</h2>
    <slot></slot>
  </div>
`
```

## Web Components核心概念

### 1. 自定义元素

```javascript
class CustomCard extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .card-header {
          background: #f5f5f5;
          padding: 16px;
        }
        .card-content {
          padding: 16px;
        }
      </style>
      <div class="card-header">
        <slot name="header">默认标题</slot>
      </div>
      <div class="card-content">
        <slot></slot>
      </div>
    `
  }
}

customElements.define('custom-card', CustomCard)
```

### 2. HTML模板

```html
<template id="custom-template">
  <style>
    .template-content {
      border: 2px dashed #666;
      padding: 15px;
      margin: 10px;
    }
  </style>
  <div class="template-content">
    <slot name="title">默认标题</slot>
    <hr />
    <slot>默认内容</slot>
  </div>
</template>

<script>
  class TemplateElement extends HTMLElement {
    constructor() {
      super()
      const template = document.getElementById('custom-template').content
      const shadowRoot = this.attachShadow({ mode: 'open' }).appendChild(template.cloneNode(true))
    }
  }

  customElements.define('template-element', TemplateElement)
</script>
```

### 3. 插槽系统

```html
<!-- 使用自定义元素 -->
<custom-card>
  <h2 slot="header">卡片标题</h2>
  <p>这是卡片的主要内容</p>
  <div slot="footer">卡片底部</div>
</custom-card>

<script>
  class SlottedCard extends HTMLElement {
    constructor() {
      super()
      const shadow = this.attachShadow({ mode: 'open' })

      shadow.innerHTML = `
      <style>
        ::slotted(h2) {
          margin: 0;
          color: #2c3e50;
        }
        ::slotted([slot="footer"]) {
          border-top: 1px solid #eee;
          padding-top: 10px;
          color: #666;
        }
      </style>
      <div class="card">
        <slot name="header"></slot>
        <div class="content">
          <slot></slot>
        </div>
        <slot name="footer"></slot>
      </div>
    `
    }
  }

  customElements.define('slotted-card', SlottedCard)
</script>
```

## 生命周期回调

自定义元素提供了多个生命周期回调：

```javascript
class LifecycleElement extends HTMLElement {
  // 元素被创建时
  constructor() {
    super()
    console.log('元素被创建')
  }

  // 元素被添加到文档时
  connectedCallback() {
    console.log('元素被添加到DOM')
  }

  // 元素从文档中移除时
  disconnectedCallback() {
    console.log('元素从DOM中移除')
  }

  // 元素的属性发生变化时
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`属性${name}从${oldValue}变为${newValue}`)
  }

  // 声明需要观察的属性
  static get observedAttributes() {
    return ['title', 'theme']
  }
}
```

## 最佳实践

### 1. 性能优化

```javascript
class OptimizedElement extends HTMLElement {
  constructor() {
    super()
    // 使用DocumentFragment优化DOM操作
    const fragment = document.createDocumentFragment()
    const shadow = this.attachShadow({ mode: 'open' })

    // 批量更新DOM
    requestAnimationFrame(() => {
      // 构建DOM树
      const elements = this.buildElements()
      fragment.append(...elements)
      shadow.appendChild(fragment)
    })
  }

  buildElements() {
    // 返回需要添加的元素数组
    return [
      /* elements */
    ]
  }
}
```

### 2. 样式封装

```javascript
class StyledElement extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    // 使用CSS变量实现主题定制
    shadow.innerHTML = `
      <style>
        :host {
          --primary-color: #42b983;
          --secondary-color: #2c3e50;
          display: block;
        }
        :host([theme="dark"]) {
          --primary-color: #42b983;
          --secondary-color: #34495e;
          background: #1a1a1a;
          color: #fff;
        }
        .content {
          color: var(--primary-color);
        }
      </style>
      <div class="content">
        <slot></slot>
      </div>
    `
  }
}
```

### 3. 无障碍性

```javascript
class AccessibleElement extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    shadow.innerHTML = `
      <div role="region" aria-label="可访问的组件">
        <button 
          aria-expanded="false"
          aria-controls="content"
          @click="this.toggleContent"
        >
          展开/收起
        </button>
        <div 
          id="content"
          role="region"
          aria-hidden="true"
        >
          <slot></slot>
        </div>
      </div>
    `
  }

  toggleContent(event) {
    const button = event.target
    const content = this.shadowRoot.getElementById('content')
    const isExpanded = button.getAttribute('aria-expanded') === 'true'

    button.setAttribute('aria-expanded', !isExpanded)
    content.setAttribute('aria-hidden', isExpanded)
  }
}
```

## 实际应用示例

### 1. 自定义对话框

```javascript
class CustomDialog extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    shadow.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: none;
          justify-content: center;
          align-items: center;
        }
        :host([open]) {
          display: flex;
        }
        .dialog {
          background: white;
          padding: 20px;
          border-radius: 8px;
          min-width: 300px;
        }
        .close-btn {
          float: right;
          border: none;
          background: none;
          cursor: pointer;
        }
      </style>
      <div class="dialog">
        <button class="close-btn" aria-label="关闭对话框">×</button>
        <slot name="header"></slot>
        <slot></slot>
      </div>
    `

    this.closeBtn = shadow.querySelector('.close-btn')
    this.closeBtn.addEventListener('click', () => this.close())
  }

  open() {
    this.setAttribute('open', '')
  }

  close() {
    this.removeAttribute('open')
  }
}

customElements.define('custom-dialog', CustomDialog)
```

### 2. 响应式图片卡片

```javascript
class ImageCard extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 100%;
        }
        .card {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s;
        }
        .card:hover img {
          transform: scale(1.1);
        }
        .overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 10px;
          transform: translateY(100%);
          transition: transform 0.3s;
        }
        .card:hover .overlay {
          transform: translateY(0);
        }
      </style>
      <div class="card">
        <img loading="lazy">
        <div class="overlay">
          <slot></slot>
        </div>
      </div>
    `

    this.img = shadow.querySelector('img')
  }

  static get observedAttributes() {
    return ['src', 'alt']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' || name === 'alt') {
      this.img[name] = newValue
    }
  }
}

customElements.define('image-card', ImageCard)
```

## 总结

:::tip
Shadow DOM和Web Components为现代Web开发提供了强大的组件化解决方案：

- Shadow DOM提供了样式隔离和DOM封装
- 自定义元素让我们能够创建可重用的HTML标签
- HTML模板和插槽系统提供了灵活的内容分发机制
- 生命周期回调让组件行为更可控

通过合理运用这些特性，我们可以构建出更模块化、可维护的Web应用。
:::
