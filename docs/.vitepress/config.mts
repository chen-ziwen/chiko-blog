import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: blogTheme,
  metaChunk: true,
  // base,
  lang: 'zh-cn',
  title: "Chiko's Blog",
  description: '知识的港湾，思维的工坊',
  lastUpdated: true,
  cleanUrls: true, // 清除 .html 后缀，后端需要重定向
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: '目录'
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',

    // 设置logo
    logo: '/logo.png',
    editLink: {
      pattern: 'https://github.com/chen-ziwen/chiko_blog/tree/main/docs/:path',
      text: '去 GitHub 上编辑内容'
    },
    nav: [
      // {
      //   text: '技术笔记',
      //   items: [
      //     { text: '模板工程', link: '/technology/tpl/' },
      //     { text: '源码学习', link: '/technology/source/' },
      //     { text: '技术概念', link: '/technology/theory/' },
      //     { text: '个人作品', link: '/technology/works/' },
      //   ]
      // },
      {
        text: '计算机基础',
        items: [
          { text: '算法与数据结构', link: '/computer-base/algorithm/' },
          { text: '操作系统', link: '/computer-base/os/' },
          { text: '计算机网络', link: '/computer-base/internet/' },
          { text: '设计模式', link: '/computer-base/design/' }
        ]
      },
      {
        text: '大前端',
        items: [
          { text: 'javascript', link: '/big-web/js/' },
          { text: 'vue', link: '/big-web/vue/' },
          { text: 'html', link: '/big-web/html/' },
          { text: 'css', link: '/big-web/css/' },
          { text: '浏览器', link: '/big-web/browser/' },
          { text: 'Web性能优化', link: '/big-web/performance/' },
          { text: '前端工程化', link: '/big-web/engineered/' },
          { text: 'nodejs', link: '/big-web/node/' }
        ]
      },
      {
        text: '小记',
        link: '/xiaoji/'
      },
      {
        text: '网站导航',
        items: [
          { text: '大前端', link: 'http://www.alloyteam.com/nav/' },
          { text: 'AI 工具', link: 'https://openi.cn/' },
          { text: '灰大设计', link: 'https://www.huisezhizhao.com/' },
          { text: 'NodeJS 中文网', link: 'https://nodejs.cn/' },
          { text: 'Hello 算法', link: 'https://www.hello-algo.com/' },
          { text: '无限邮箱', link: 'https://2925.com/' },
          { text: 'Git 学习', link: 'https://learngitbranching.js.org/?locale=zh_CN' },
          {
            text: 'CSS 布局游戏',
            items: [
              { text: 'Flex 布局', link: 'https://flexboxfroggy.com/' },
              { text: 'Grid 布局', link: 'https://cssgridgarden.com/' }
            ]
          }
        ]
      },
      {
        text: '个人站点',
        items: [
          {
            text: 'GitHub',
            link: 'https://github.com/chen-ziwen/chiko_blog'
          },
          {
            text: '掘金',
            link: 'https://juejin.cn/user/2731615071779406'
          },
          {
            text: 'CSDN',
            link: 'https://blog.csdn.net/weixin_43320737?spm=1000.2115.3001.5343'
          }
        ]
      }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/chen-ziwen/chiko_blog'
      }
    ]
  }
})
