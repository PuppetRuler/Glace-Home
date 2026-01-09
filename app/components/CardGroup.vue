<template>
  <div class="w-full max-w-6xl mx-auto pt-8">
    <div class="flex items-center space-x-2 mb-6 px-4 text-zinc-800 dark:text-white/90 transition-colors duration-300">
      <UIcon
        name="i-heroicons-link"
        class="w-6 h-6 rotate-45"
      />
      <h2 class="text-xl font-medium tracking-wider">
        网站列表
      </h2>
    </div>

    <div
      ref="scrollContainer"
      class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      @scroll="handleScroll"
    >
      <div
        v-for="(page, pIndex) in pages"
        :key="pIndex"
        class="min-w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 snap-center pb-8"
      >
        <div
          v-for="item in page"
          :key="item.name"
          class="relative border-none"
        >
          <a
            v-if="item.url"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group h-32 cursor-pointer transition-all duration-500 rounded-2xl dark:shadow-[0_2px_4px_1px_rgba(0,0,0,0.5),inset_-1px_1px_4px_1px_rgba(255,255,255,0.2)] bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center gap-2 hover:scale-105 hover:shadow-[-15px_15px_30px_rgba(0,0,0,0.5)] text-center"
          >
            <div class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div class="absolute -top-[50%] -right-[50%] w-full h-full bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
            </div>
            <UIcon
              :name="item.icon"
              class="w-10 h-10 transition-colors duration-300 text-zinc-800 dark:text-white"
            />
            <span class="text-xl font-normal tracking-widest transition-colors duration-300 text-zinc-800 dark:text-white/90">
              {{ item.name }}
            </span>
          </a>

          <div
            v-else
            class="card-unavailable group relative h-32 cursor-not-allowed transition-all duration-500 rounded-2xl dark:shadow-[0_2px_4px_1px_rgba(0,0,0,0.5),inset_-1px_1px_4px_1px_rgba(255,255,255,0.2)] bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center gap-2 hover:scale-105 text-center"
          >
            <div class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div class="absolute -top-[50%] -right-[50%] w-full h-full bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
            </div>
            <UIcon
              :name="item.icon"
              class="w-10 h-10 transition-colors duration-300 text-zinc-800 dark:text-white"
            />
            <span class="text-xl font-normal tracking-widest transition-colors duration-300 text-zinc-800 dark:text-white/90">
              {{ item.name }}
            </span>
            <div class="card-badge absolute top-3 right-3 text-xs rounded-full px-2 py-0.5 bg-white/10 text-white/80 opacity-0 transition-opacity duration-200 pointer-events-none">
              暂不可用
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center space-x-3 pt-4">
      <button
        v-for="(_, idx) in pages"
        :key="idx"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="activeIndex === idx ? 'w-8 bg-white' : 'w-4 bg-white/20'"
        @click="scrollToPage(idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// 1. 统一管理所有链接，添加或删除只需修改此处
const allLinks = [
  { name: '博客', icon: 'i-heroicons-rss-20-solid', url: 'https://blog.glace.top' },
  { name: '网盘', icon: 'i-heroicons-cloud-20-solid' },
  { name: '音乐', icon: 'i-heroicons-musical-note-20-solid' },
  { name: '起始页', icon: 'i-heroicons-home-modern-20-solid' },
  { name: '网址集', icon: 'i-heroicons-book-open-20-solid' },
  { name: '今日热榜', icon: 'i-heroicons-fire-20-solid' },
  { name: '更多内容', icon: 'i-heroicons-ellipsis-horizontal' },
  { name: '设置', icon: 'i-heroicons-cog-6-tooth' },
  { name: '反馈', icon: 'i-heroicons-chat-bubble-left-right' }
]

const scrollContainer = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const isMobile = ref(false)

// 2. 泛型函数：改用标准 function 声明以避开 ESLint 对 <T> 的解析错误
function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

// 3. 自动计算分页内容
const pages = computed(() => {
  // 移动端 (< 640px) 每页 4 个 (2x2)，桌面端每页 6 个 (2x3 或 3x2)
  const chunkSize = isMobile.value ? 4 : 6
  return chunkArray(allLinks, chunkSize)
})

const updateBreakpoint = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.matchMedia('(max-width: 639px)').matches
  }
}

// 处理滚动监听
const handleScroll = (event: Event) => {
  const el = event.target as HTMLElement
  activeIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

// 点击指示器跳转
const scrollToPage = (index: number) => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      left: index * scrollContainer.value.clientWidth,
      behavior: 'smooth'
    })
  }
}

// --- 拖拽翻页逻辑保持不变 ---
let isDown = false
let startX = 0
let startScrollLeft = 0
let lastSamples: Array<{ x: number, t: number }> = []

const onPointerDown = (e: PointerEvent) => {
  const el = scrollContainer.value
  if (!el) return
  const target = e.target as HTMLElement | null
  if (target?.closest('a,button,input,[role="button"]')) return

  isDown = true
  try { el.setPointerCapture(e.pointerId) } catch {}
  startX = e.clientX
  startScrollLeft = el.scrollLeft
  lastSamples = [{ x: e.clientX, t: performance.now() }]
  el.classList.add('dragging')
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDown || !scrollContainer.value) return
  const dx = e.clientX - startX
  scrollContainer.value.scrollLeft = startScrollLeft - dx
  lastSamples.push({ x: e.clientX, t: performance.now() })
  if (lastSamples.length > 6) lastSamples.shift()
}

const endDrag = (e?: PointerEvent) => {
  const el = scrollContainer.value
  if (!el || !isDown) return

  const last = lastSamples[lastSamples.length - 1] || { x: startX, t: performance.now() }
  const first = lastSamples[0] || last
  const dt = Math.max(1, last.t - first.t)
  const scrollV = -(last.x - first.x) / dt
  const momentum = scrollV * 300

  const pageW = el.clientWidth
  const targetPage = Math.round((el.scrollLeft + momentum) / pageW)
  const clamped = Math.max(0, Math.min(pages.value.length - 1, targetPage))

  el.scrollTo({ left: clamped * pageW, behavior: 'smooth' })
  isDown = false
  try { if (e) el.releasePointerCapture(e.pointerId) } catch {}
  el.classList.remove('dragging')
}

onMounted(() => {
  updateBreakpoint()
  window.addEventListener('resize', updateBreakpoint)

  const el = scrollContainer.value
  if (el) {
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBreakpoint)
})
</script>

<style scoped lang="sass">
/* 隐藏滚动条但保留功能 */
.no-scrollbar
  -ms-overflow-style: none
  scrollbar-width: none
  touch-action: pan-y // 禁用默认触摸横向滚动以便自定义拖拽工作更一致

  &::-webkit-scrollbar
    display: none

/* 拖拽时的视觉与交互优化 */
.dragging
  cursor: grabbing !important
  user-select: none // 避免拖动时选中文本
  -webkit-user-select: none
  -ms-user-select: none

/* 不可用卡片样式：hover 时变灰并显示 badge */
.card-unavailable
  .card-badge
    opacity: 0

  .w-10, span
    transition: color 0.2s, opacity 0.2s

  &.group:hover
    .card-badge
      opacity: 1

    .w-10, span
      color: rgba(255, 255, 255, 0.4) !important
      opacity: 0.6

/* 左下角阴影 - 增强玻璃拟态的悬浮感 */
.group:hover
  box-shadow: -15px 15px 30px -5px rgba(0, 0, 0, 0.6)
</style>
