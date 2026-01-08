<template>
  <UApp>
    <div class="relative min-h-screen">
      <NuxtPage />
    </div>
  </UApp>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";

// 真实图片加载状态
const isLoaded = ref(false);
const bgLayer = ref<HTMLElement | null>(null);

onMounted(() => {
  // 使用 Image 预加载真实背景图
  const img = new Image();
  // 真实图片地址
  img.src = "/bg.jpg";
  img.decoding = "async";
  img.onload = () => {
    isLoaded.value = true;
    // 当图片加载好后，把真实图作为背景图应用到 .bg-real
    if (bgLayer.value) {
      const realEl = bgLayer.value.querySelector(
        ".bg-real"
      ) as HTMLElement | null;
      if (realEl) realEl.style.backgroundImage = `url('${img.src}')`;
    }
  };
});

useSeoMeta({
  // 搜索结果的紫色大标题
  title: 'Glace - 傀儡师的个人主页', 
  // 标题后缀（可选）
  titleTemplate: '%s | Glace.top',
  
  // 核心：搜索结果下方的灰色介绍文字
  description: 'Glace 的个人主页,集成了博客,网盘,联系方式等,更多功能正在开发中...欢迎各位朋友前来交流学习！',
  
  // 社交媒体分享预览（建议同步配置）
  ogTitle: 'Glace - 傀儡师的个人主页',
  ogDescription: 'Glace 的个人主页,集成了博客,网盘,联系方式等,更多功能正在开发中...欢迎各位朋友前来交流学习！',
  ogImage: '/home.png', // 分享到社交软件时的预览图
  twitterCard: 'summary_large_image',
})
</script>

<style>
/* 确保 body 没有任何边距，防止背景出现白边 */
body {
  margin: 0;
  padding: 0;
}
</style>
