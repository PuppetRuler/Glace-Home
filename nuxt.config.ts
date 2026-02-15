export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  ssr: true,
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-48.png' },
        { rel: 'apple-touch-icon', href: '/favicon-48.png' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  site: {
    url: 'https://glace.top',
    name: 'glace的主页',
    description: 'glace的主页,集成了博客,网盘,联系方式等,更多功能正在开发中...欢迎各位朋友一起交流学习！'
  },
  ui: {
    fonts: false
  },
  routeRules: {
    '/': { prerender: true }
  },
  compatibilityDate: '2026-02-15'
})
