<template>
  <UApp>
    <div class="relative h-screen w-screen">
      <NuxtPage />
    </div>
  </UApp>
</template>

<script setup lang="ts">
useSeoMeta({
  // 搜索结果的紫色大标题
  title: 'glace的个人主页',

  // 核心：搜索结果下方的灰色介绍文字
  description: 'Glace Home,个人主页,集成了博客,网盘,联系方式等,更多功能正在开发中...欢迎各位朋友一起交流学习！',

  // 社交媒体分享预览（建议同步配置）
  ogTitle: 'Glace的个人主页',
  ogDescription: 'Glace Home,个人主页,集成了博客,网盘,联系方式等,更多功能正在开发中...欢迎各位朋友一起交流学习！',
  ogImage: '/home.png', // 分享到社交软件时的预览图
  twitterCard: 'summary_large_image'
})
</script>
