// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node'

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 页脚
  footer: {
    // message 字段支持配置为HTML内容，配置多条可以配置为数组
    // message: '下面 的内容和图标都是可以修改的噢（当然本条内容也是可以隐藏的）',
    copyright: 'MIT License | chiko',
    version: false
    // icpRecord: {
    //   name: '蜀ICP备19011724号',
    //   link: 'https://beian.miit.gov.cn/'
    // },
    // securityRecord: {
    //   name: '公网安备xxxxx',
    //   link: 'https://www.beian.gov.cn/portal/index.do'
    // },
  },

  // 主题色修改
  themeColor: 'el-yellow',

  // 文章默认作者
  author: 'Chiko',

  // 相关文章
  recommend: {
    title: '✨ 相关文章',
    pageSize: 10
  },

  // 文章评论
  comment: {
    repo: 'chen-ziwen/chiko_blog',
    repoId: 'R_kgDON_Ep0g',
    category: 'Announcements',
    categoryId: 'DIC_kwDON_Ep0s4CndAR',
    inputPosition: 'bottom'
  },

  // 友链
  // friend: [
  //   {
  //     nickname: 'Vitepress',
  //     des: 'Vite & Vue Powered Static Site Generator',
  //     avatar: 'https://vitepress.dev/vitepress-logo-large.webp',
  //     url: 'https://vitepress.dev/'
  //   }
  // ],

  // 公告
  // popover: {
  //   title: '公告',
  //   body: [
  //     { type: 'text', content: '👇公众号👇---👇 微信 👇' },
  //     {
  //       type: 'image',
  //       src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210~fmt.webp'
  //     },
  //     {
  //       type: 'text',
  //       content: '欢迎大家找我交流！'
  //     }
  //   ],
  //   duration: 0
  // },
  article: {
    readingTime: true
  }
})

export { blogTheme }
