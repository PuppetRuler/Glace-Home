<template>
  <UApp>
    <div class="relative min-h-screen">
      <div
        class="fixed inset-0 z-[-1] bg-[url('/bg.jpg')] bg-cover bg-center transition-all duration-500"
      ></div>

      <div
        class="fixed inset-0 z-[-1] vignette-overlay backdrop-saturate-150"
      ></div>

      <div class="relative z-10">
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts"></script>

<style>
/* 确保 body 没有任何边距，防止背景出现白边 */
body {
  margin: 0;
  padding: 0;
}

/* 遮罩层：中心浓郁、向外围淡出 */
.vignette-overlay {
  pointer-events: none;
  position: fixed;
  inset: 0;

  /* 默认变量（亮色模式）：对应淡白色/淡灰色 */
  
  
  background-image: radial-gradient(
    ellipse at center, 
    rgba(var(--bg-gradient-home), 0.25) 0%, 
    rgba(var(--bg-gradient-home), 0.85) 150%
  );
  
  transition: background 300ms ease;
}

/* 深色模式：切换 RGB 数值 */
.dark .vignette-overlay {
  --bg-gradient-home: 20, 20, 20;
}
@media (prefers-reduced-motion: reduce) {
  .vignette-overlay { transition: none; }
}
</style>
