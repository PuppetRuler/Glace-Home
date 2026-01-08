export default defineNuxtConfig({
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
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],
  ui: {
    "fonts": false
  },
  devtools: {
    enabled: true
  },
  css: ['~/assets/css/main.css'],
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
