<template>
  <div class="container min-h-screen min-w-screen bg-img">
    <!-- 遮罩层 -->
    <div class="fixed inset-0 vignette-overlay backdrop-saturate-150 z-0" />
    <UContainer class="min-h-screen flex flex-col pt-3 relative z-10">
      <!-- 页眉 -->
      <div class="w-full z-50">
        <Transition
          name="fade-slide"
          mode="out-in"
        >
          <header
            v-if="loading"
            key="header-skeleton"
            class="w-full py-4 px-6 flex justify-between items-center"
          >
            <div class="flex items-center space-x-2">
              <div class="skeleton w-8 h-8 rounded-full" />
              <div class="skeleton w-28 h-5 rounded-md" />
            </div>

            <div class="flex items-center space-x-4">
              <div class="skeleton w-20 h-8 rounded-full hidden sm:block" />
              <div class="skeleton w-8 h-8 rounded-full" />
            </div>
          </header>

          <AppHeader
            v-else
            key="header-real"
          />
        </Transition>
      </div>
      <UMain class="flex-1 grid lg:grid-cols-5 items-center min-h-0">
        <!-- 左侧：PerBoard 或其骨架 -->
        <div class="lg:col-span-2 mt-4 sm:mt-0 lg:h-4/5 min-h-40">
          <Transition
            name="fade-slide"
            mode="out-in"
          >
            <template v-if="loading">
              <div
                class="w-full h-full rounded-4xl bg-white/5 backdrop-blur-sm p-6 flex flex-col items-center"
              >
                <div class="flex-3 w-full flex items-center gap-6">
                  <div
                    class="skeleton w-30 h-30 lg:w-25 lg:h-40 rounded-full lg:rounded-3xl ring-4 ring-white/5"
                  />

                  <div class="flex-1 flex justify-center items-center">
                    <div class="skeleton h-20 w-40 rounded-xl" />
                  </div>
                </div>

                <div
                  class="flex-1 w-full flex gap-3 justify-center items-center border-t border-white/5"
                >
                  <div
                    v-for="i in 3"
                    :key="i"
                    class="skeleton h-10 w-10 rounded-lg"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <PerBoard />
            </template>
          </Transition>
        </div>

        <!-- 右侧：CardsBoard 或其骨架 -->
        <div
          class="lg:col-span-3 h-full flex justify-center items-center sm:px-[10%] min-h-0 overflow-hidden"
        >
          <Transition
            name="fade-slide"
            mode="out-in"
          >
            <template v-if="loading">
              <div class="grid grid-cols-1 grid-rows-5 w-full h-full">
                <div class="row-span-1 hidden sm:block mt-8">
                  <div
                    class="h-1/2 w-full rounded-full bg-white/5 backdrop-blur-sm border border-white/5 flex items-center px-4"
                  >
                    <div class="flex w-full h-full items-center">
                      <div class="flex-1 flex items-center gap-4">
                        <div class="skeleton h-6 w-6 rounded-full" />
                        <div class="skeleton h-6 w-20 rounded" />
                      </div>
                      <div
                        class="ml-4 flex-4 h-3/4 rounded-full bg-black/20 flex items-center justify-center px-4"
                      >
                        <div class="skeleton h-3 w-1/2 rounded opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row-span-4 h-full w-full pt-4">
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div
                      v-for="n in 6"
                      :key="n"
                      class="flex flex-col items-center space-y-4"
                    >
                      <div
                        class="skeleton h-28 w-28 sm:h-32 sm:w-32 rounded-3xl"
                      />
                      <div class="skeleton h-4 w-12 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <CardsBoard />
            </template>
          </Transition>
        </div>
      </UMain>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import * as ThumbHash from '../../public/js/thumbhash'

// 简单加载状态：可以在未来替换为真实的数据加载逻辑或由子组件触发
const loading = ref(true)

onMounted(() => {
  // 给出一个最小的骨架显示时间以避免闪烁
  const minSkeletonMs = 350
  setTimeout(() => (loading.value = false), minSkeletonMs)
})

onMounted(async () => {
  const el = document.querySelector('.bg-img') as HTMLElement
  if (!el) return

  const isDesktop = window.innerWidth >= 768
  const ORIGINAL_URL = isDesktop
    ? '/bg.jpg'
    : 'https://fastly.jsdelivr.net/gh/PuppetRuler/drawing-board@main/images/1726620907142bg.jpg'

  /* ========== 1. 生成 ThumbHash 占位图 ========== */

  const image = new Image()
  image.crossOrigin = 'Anonymous'
  image.src = ORIGINAL_URL

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = reject // 捕获加载失败
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const scale = 100 / Math.max(image.width, image.height)
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const binaryThumbHash = ThumbHash.rgbaToThumbHash(
        pixels.width,
        pixels.height,
        pixels.data
      )
      const placeholderURL = ThumbHash.thumbHashToDataURL(binaryThumbHash)

      el.style.setProperty('--bg-placeholder', `url(${placeholderURL})`)
    }
  } catch (e) {
    console.error('ThumbHash 生成失败:', e)
  }

  /* ========== 2. 写入占位背景（模糊层） ========== */

  const img = new Image()
  img.src = ORIGINAL_URL

  const finishLoading = () => {
    el.style.setProperty('--bg-img', `url(${ORIGINAL_URL})`)
    el.classList.add('loaded')
  }

  if (img.complete) {
    finishLoading()
  } else {
    img.onload = finishLoading
    img.onerror = finishLoading // 避免卡死在模糊状态
  }
})
</script>

<style scoped lang="sass">
// 骨架屏基础样式
.skeleton
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.06) 25%, rgba(0, 0, 0, 0.02) 37%, rgba(0, 0, 0, 0.06) 63%)
  background-size: 400% 100%
  animation: shimmer 1.2s ease-in-out infinite

.skeleton-card
  background: transparent

// 骨架屏动画
@keyframes shimmer
  0%
    background-position: 100% 0
  100%
    background-position: -100% 0

// 背景图片容器逻辑
.bg-img
  position: relative
  overflow: hidden
  --bg-blur-opacity: 1
  --bg-clear-opacity: 0

  // 模糊层 (Before)
  &::before
    content: ""
    position: absolute
    inset: 0
    background-image: var(--bg-img-blur)
    background-size: cover
    background-position: center
    filter: blur(20px)
    transform: scale(1.1)
    opacity: var(--bg-blur-opacity)
    transition: opacity 0.5s ease
    z-index: -2

  // 清晰层 (After)
  &::after
    content: ""
    position: absolute
    inset: 0
    background-image: var(--bg-img)
    background-size: cover
    background-position: center
    opacity: var(--bg-clear-opacity)
    transition: opacity 0.5s ease
    z-index: -1

  // 加载完成后的状态切换
  &.loaded
    --bg-blur-opacity: 0
    --bg-clear-opacity: 1

// 遮罩层：径向渐变
.vignette-overlay
  pointer-events: none
  position: fixed
  inset: 0
  background-image: radial-gradient(ellipse at center, rgba(var(--bg-gradient-home), 0.25) 0%, rgba(var(--bg-gradient-home), 0.85) 150%)
  transition: background 300ms ease

  @media (prefers-reduced-motion: reduce)
    transition: none

// 深色模式适配
.dark
  .vignette-overlay
    --bg-gradient-home: 20, 20, 20

// 统一内容切换动画 (Nuxt Transition)
.fade-slide
  &-enter-active, &-leave-active
    transition: opacity 0.5s ease, transform 0.5s ease

  &-enter-from
    opacity: 0
    transform: translateY(10px)

  &-leave-to
    opacity: 0
    transform: translateY(-10px)
</style>
