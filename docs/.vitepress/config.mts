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
    // editLink: {
    //   pattern: 'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: [
      // {
      //   text: '关于我',
      //   link: '/aboutme'
      // },
      {
        text: '技术笔记',
        items: [
          { text: '技术教程', link: '/technology/learn/' },
          { text: '模板工程', link: '/technology/tpl/' },
          { text: '源码学习', link: '/technology/source/' },
          { text: '技术概念', link: '/technology/theory/' },
          { text: '个人作品', link: '/technology/works/' },
          { text: '学习笔记', link: '/technology/study/' }
        ]
      },
      {
        text: '计算机基础',
        items: [
          { text: '算法与数据结构', link: '/computerBase/algorithm/' },
          { text: '操作系统', link: '/computerBase/os/' },
          { text: '计算机网络', link: '/computerBase/Internet/' },
          { text: '设计模式', link: '/computerBase/design/' },
          { text: '剑指offer', link: '/computerBase/offer/' }
          // { text: '力扣', link: '/computerBase/leetcode/' }
        ]
      },
      {
        text: '大前端',
        items: [
          { text: 'javascript', link: '/bigWeb/js/' },
          { text: 'vue', link: '/bigWeb/vue/' },
          { text: 'html', link: '/bigWeb/html/' },
          { text: 'css', link: '/bigWeb/css/' },
          { text: '🌏浏览器专题', link: '/bigWeb/browser/' },
          { text: 'Web性能优化', link: '/bigWeb/performance/' },
          { text: 'regexp', link: '/bigWeb/regexp/' },
          { text: 'node', link: '/bigWeb/node/' }
        ]
      },
      {
        text: '面试',
        items: [
          { text: '心得总结', link: '/offer/experience/' },
          { text: '校招考点汇总', link: '/offer/campus/' },
          { text: '面经汇总', link: '/offer/sum-interview/' },
          { text: '复习自查', link: '/offer/review/' },
          { text: '问解', link: '/interview/problem/' },
          { text: 'javascript', link: '/interview/js/' },
          { text: 'css', link: '/interview/css/' },
          { text: '手撕代码', link: '/interview/code/' },
          { text: '性能优化', link: '/interview/performance/' },
          // { text: "网络", link: "/interview/internet/" },
          // { text: '操作系统', link: '/interview/os/' },
          // { text: '设计模式', link: '/interview/design/' },
          { text: '综合问题', link: '/interview/other/' },
          { text: '面经汇总', link: '/offer/sum-interview/' },
          { text: '小程序', link: '/interview/mini/' }
          // { text: '面经', link: '/interview/experience/' }
        ]
      },
      {
        text: '手撕代码',
        items: [
          { text: '数据结构与算法', link: '/coding/algorithm/' },
          { text: 'javascript', link: '/coding/js/' },
          { text: 'css', link: '/coding/css/' }
        ]
      },
      // {
      //   text: '个人站点',
      //   items: [
      //     {
      //       text: 'GitHub',
      //       link: 'https://github.com/ATQQ/sugar-blog'
      //     },
      //     {
      //       text: '博客园',
      //       link: 'https://www.cnblogs.com/roseAT/'
      //     },
      //     {
      //       text: '掘金',
      //       link: 'https://juejin.im/user/1028798615918983'
      //     }
      //     // {
      //     //   text: "GitBook-blog",
      //     //   link: "https://sugar-at.gitbook.io/blog-article/",
      //     //   icon: "reco-blog",
      //     // },
      //     // {
      //     //   text: "GitBook-ES6",
      //     //   link: "https://sugar-js.gitbook.io/-1/",
      //     //   icon: "reco-document",
      //     // },
      //   ]
      // },
      {
        text: '线上作品',
        items: [
          {
            text: '轻取(文件收集)',
            link: 'https://ep2.sugarat.top'
          },
          {
            text: '个人图床',
            link: 'https://imgbed.sugarat.top'
          },
          {
            text: '考勤小程序',
            link: 'https://hdkq.sugarat.top/'
          },
          {
            text: '时光恋人',
            link: 'https://lover.sugarat.top'
          },
          {
            text: '在线简历生成',
            link: 'https://resume.sugarat.top/'
          }
        ]
      }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://git@github.com:chen-ziwen/chiko_blog.git'
      }
    ]
  }
})
