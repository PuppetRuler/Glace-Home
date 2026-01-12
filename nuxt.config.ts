export default defineNuxtConfig({
  // 站点基础配置
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  devtools: {
    enabled: true
  },
  app: {
    head: {
      link: [
        // 核心：Google 搜索抓取的图标
        { rel: 'icon', type: 'image/png', href: '/favicon-48.png' },
        // Apple 设备图标（建议也加上）
        { rel: 'apple-touch-icon', href: '/favicon-48.png' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  site: { url: 'https://glace.top',
    name: '傀儡师的主页', description: '傀儡师|glace的主页,集成了博客,网盘,联系方式等,更多功能正在开发中...欢迎各位朋友一起交流学习！'
  },
  ui: {
    fonts: false
  },
  routeRules: {
    '/': { prerender: true }
  },
  compatibilityDate: '2025-01-15',
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
