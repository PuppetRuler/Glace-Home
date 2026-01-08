<template>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import * as ThumbHash from '../../public/js/thumbhash'; 

interface Props {
  src?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: '/bg.jpg' // 默认指向 public/bg.jpg
});

onMounted(async () => {
  // 1. 只有在客户端环境执行，防止 SSR 报错
  if (!import.meta.client) return;

  const img = new Image();
  img.src = props.src;

  const handleImageLogic = async () => {
    // 等待图片加载以获取像素数据
    if (!img.complete) {
      await new Promise((resolve) => (img.onload = resolve));
    }

    // 2. 生成 ThumbHash 占位图
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    const scale = 100 / Math.max(img.width, img.height);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    
    const binaryThumbHash = ThumbHash.rgbaToThumbHash(
      pixels.width,
      pixels.height,
      pixels.data
    );
    const placeholderURL = ThumbHash.thumbHashToDataURL(binaryThumbHash);

    // 3. 更新 CSS 变量
    const el = document.documentElement;
    el.style.setProperty("--bg-placeholder", `url(${placeholderURL})`);
    el.style.setProperty("--bg-image", `url(${props.src})`);
  };

  handleImageLogic().catch(err => console.error("Background Load Error:", err));
});
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .bg-img::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
    /* 亮度设置与变量切换 */
    filter: brightness(0.5);
    background-image: var(--bg-image, var(--bg-placeholder));
    transition: background-image 0.6s ease-in-out;
  }
}

/* 移动端简单处理 */
@media screen and (max-width: 767px) {
  .bg-img::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image: url("https://fastly.jsdelivr.net/gh/PuppetRuler/drawing-board@main/images/1726620907142bg.jpg");
    background-size: cover;
    background-position: center;
    filter: brightness(0.5);
  }
}
</style>