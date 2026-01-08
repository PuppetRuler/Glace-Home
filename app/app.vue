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
</script>

<style>
/* 确保 body 没有任何边距，防止背景出现白边 */
body {
  margin: 0;
  padding: 0;
}
</style>
