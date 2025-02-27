---
title: 前端路由
description: hash 路由和 history 路由的区别和简单实现原理
date: 2025-02-26
isTimeLine: true
tags:
  - javascript
  - 大前端
---

# 前端路由

> 在深入探讨 Vue Router 的`history`模式和`hash`模式的区别以及为什么前者需要服务器重定向而后者不需要之前，我们需要先理解这两种模式的工作原理。

:::tip 提示
其实本质很简单，不管 `history`还是`hash`，它们的目的都只是想要让客户端监听到`url`的变化而已，`history`需要在服务器配置重定向其实是一个副作用。因为单页面应用的路由系统就是通过`url`的变化去切换不同的路由组件展示不同页面的模块。
:::

## Hash 模式

`hash`模式利用了 URL 中的哈希部分（即`#`后面的内容）来模拟一个完整的 URL。由于这部分不会被发送到服务器，因此当 URL 改变时，页面不会重新加载。这意味着无论你在应用中如何导航，只有`/#`前的部分会被视为资源请求发送给服务器。如果用户直接访问或刷新带有哈希值的 URL，比如`http://example.com/#/user/id`，服务器接收到的请求将是`http://example.com/`，这通常指向的是你的前端应用的入口文件`index.html`，该文件包含了必要的 JavaScript 代码以初始化Vue 应用并处理路由逻辑。

因此，在使用`hash`模式时，即使用户直接访问某个特定的路由或刷新页面，也不会遇到404错误，因为所有的路由变化都在客户端完成，且不依赖于服务器端的任何配置。

### 简单案例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="navigation">
      <!-- 导航链接 -->
      <a href="#/">首页</a>
      <a href="#/about">关于</a>
      <a href="#/contact">联系</a>
    </div>
    <div id="content">
      <!-- 内容区域 -->
    </div>
  </body>

  <script>
    // 定义一个对象来存储不同的页面内容或处理函数
    const routes = {
      '': () => renderHome(),
      '#/home': () => renderHome(),
      '#/about': () => renderAbout(),
      '#/contact': () => renderContact()
    }

    // 页面渲染函数
    function renderHome() {
      document.getElementById('content').innerHTML = '<h1>欢迎来到首页</h1>'
    }

    function renderAbout() {
      document.getElementById('content').innerHTML = '<h1>关于我们</h1>'
    }

    function renderContact() {
      document.getElementById('content').innerHTML = '<h1>联系我们</h1>'
    }

    // 根据当前URL哈希值加载对应的页面
    function handleRoute() {
      const hash = window.location.hash || ''
      const routeHandler = routes[hash] || (() => renderNotFound())
      routeHandler()
    }

    // 404页面渲染函数
    function renderNotFound() {
      document.getElementById('content').innerHTML = '<h1>404 - 页面未找到</h1>'
    }

    // 监听hash变化并更新页面
    window.addEventListener('hashchange', handleRoute)

    // 初始化时也调用一次handleRoute以显示正确的初始页面
    handleRoute()
  </script>
</html>
```

## History 模式

相比之下，`history`模式使用的是 HTML5 的 History API，如`pushState()`和`replaceState()`方法，这些方法允许你修改浏览器地址栏的URL而不触发新的页面加载请求。这意味着你可以拥有更加美观、传统风格的 URL，例如`http://example.com/user/id`，而无需在URL中包含`#`符号。

然而，这也带来了一个挑战：当你直接访问或刷新一个这样的路径时，服务器会尝试查找与该路径匹配的实际文件。由于这是一个单页应用（SPA），服务器上并没有对应于`/user/id`的具体文件，除非服务器被正确配置为返回前端应用的入口点`index.html`，否则就会导致404错误。

为了克服这个问题，你需要在服务器端进行配置，确保所有未找到的静态资源请求都被重定向到`index.html`。这样，Vue Router 可以接管并根据当前 URL 渲染正确的组件。具体的服务器配置取决于你使用的 Web 服务器类型，比如 Apache、Nginx 或是 Node.js 等。

### 简单案例

#### 服务器

以下是一些常见的服务器配置示例：

- **Nginx**:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

- **Apache**:

```plain
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

```

通过上述配置，当用户尝试访问不存在的路径时，服务器会返回`index.html`，然后由Vue Router负责解析URL并显示相应的视图。

#### 客户端

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <ul>
      <li><a href="/home">Home</a></li>
      <li><a href="/about">About</a></li>
      <div id="routeView"></div>
    </ul>

    <script>
      window.addEventListener('DOMContentLoaded', onLoad)
      window.addEventListener('popstate', onPopState)

      var routerView = null

      function onLoad() {
        routerView = document.querySelector('#routeView')
        interceptLinks()
        onPopState()
      }

      function interceptLinks() {
        var links = document.querySelectorAll('a[href]')
        links.forEach((link) => {
          link.addEventListener('click', (e) => {
            e.preventDefault()
            history.pushState(null, '', link.getAttribute('href'))
            onPopState()
          })
        })
      }

      function onPopState() {
        switch (location.pathname) {
          case '/home':
            routerView.innerHTML = 'Home'
            break
          case '/about':
            routerView.innerHTML = 'About'
            break
          default:
            routerView.innerHTML = ''
        }
      }
    </script>
  </body>
</html>
```

## 总结

简而言之，`hash`模式由于其工作方式（不向服务器发送哈希部分），使得它能够独立于服务器配置运行，非常适合那些不想或者无法更改服务器设置的应用。而`history`模式虽然提供了更优雅的 URL 结构，但它要求服务器能够正确处理所有可能的前端路由，并将它们重定向到应用的入口点。这种差异决定了为什么`history`模式需要服务器重定向支持，而`hash`模式则不需要。

希望这个详细的解释能帮助你更好地理解Vue Router的两种路由模式及其背后的技术细节。如果你有进一步的问题或需要更深入的信息，请随时提问。
