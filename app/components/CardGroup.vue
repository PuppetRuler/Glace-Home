<template>
  <div class="w-full max-w-6xl mx-auto p-8">
    <div class="flex items-center space-x-2 text-white/90 mb-6 px-4">
      <UIcon name="i-heroicons-link" class="w-6 h-6 rotate-45" />
      <h2 class="text-xl font-medium tracking-wider">网站列表</h2>
    </div>

    <div 
      ref="scrollContainer"
      class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      @scroll="handleScroll"
    >
      <div class="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 snap-center pb-8">
        <div
          v-for="item in page1"
          :key="item.name"
          class="relative"
        >
          <!-- 博客为可点击外链 -->
          <a
            v-if="item.name === '博客'"
            :href="'https://blog.glace.top'"
            target="_blank"
            rel="noopener noreferrer"
            class="group h-32 cursor-pointer transition-all duration-500 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center gap-2 hover:scale-105 hover:shadow-[-15px_15px_30px_rgba(0,0,0,0.5)] text-center"
          >
            <div class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div class="absolute -top-[50%] -right-[50%] w-full h-full bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
            </div>
            <UIcon :name="item.icon" class="w-10 h-10 text-white" />
            <span class="text-xl font-normal text-white tracking-widest">{{ item.name }}</span>
          </a>

          <!-- 其他卡片视觉为暂不可用 -->
          <div
            v-else
            class="card-unavailable group relative h-32 cursor-not-allowed transition-all duration-500 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center gap-2 hover:scale-105 text-center"
          >
            <div class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div class="absolute -top-[50%] -right-[50%] w-full h-full bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
            </div>
            <UIcon :name="item.icon" class="w-10 h-10 text-white/60" />
            <span class="text-xl font-normal text-white/60 tracking-widest">{{ item.name }}</span>

            <div class="card-badge absolute top-3 right-3 text-xs rounded-full px-2 py-0.5 bg-white/10 text-white/80 opacity-0 transition-opacity duration-200 pointer-events-none">暂不可用</div>
          </div>
        </div>
      </div>

      <div class="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 snap-center pb-8">
        <div
          v-for="item in page2"
          :key="item.name"
          class="relative"
        >
          <div class="card-unavailable group relative h-32 cursor-not-allowed transition-all duration-500 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center gap-2 hover:scale-105 text-center">
            <UIcon :name="item.icon" class="w-10 h-10 text-white/50" />
            <span class="text-xl font-normal text-white/50 tracking-widest">{{ item.name }}</span>
            <div class="card-badge absolute top-3 right-3 text-xs rounded-full px-2 py-0.5 bg-white/10 text-white/80 opacity-0 transition-opacity duration-200 pointer-events-none">暂不可用</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center space-x-3 pt-4">
      <button 
        @click="scrollToPage(0)"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="activeIndex === 0 ? 'w-8 bg-white' : 'w-4 bg-white/20'"
      ></button>
      <button 
        @click="scrollToPage(1)"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="activeIndex === 1 ? 'w-8 bg-white' : 'w-4 bg-white/20'"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const page1 = [
  { name: '博客', icon: 'i-heroicons-rss-20-solid' },
  { name: '网盘', icon: 'i-heroicons-cloud-20-solid' },
  { name: '音乐', icon: 'i-heroicons-musical-note-20-solid' },
  { name: '起始页', icon: 'i-heroicons-home-modern-20-solid' },
  { name: '网址集', icon: 'i-heroicons-book-open-20-solid' },
  { name: '今日热榜', icon: 'i-heroicons-fire-20-solid' }
]

const page2 = [
  { name: '更多内容', icon: 'i-heroicons-ellipsis-horizontal' },
  { name: '设置', icon: 'i-heroicons-cog-6-tooth' },
  { name: '反馈', icon: 'i-heroicons-chat-bubble-left-right' }
]

// 处理滚动监听，更新指示器状态
const handleScroll = (event: Event) => {
  const el = event.target as HTMLElement
  activeIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

// 点击指示器跳转
const scrollToPage = (index: number) => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ left: index * scrollContainer.value.clientWidth, behavior: 'smooth' })
  }
}

// --- 拖拽翻页实现（支持鼠标与触摸） ---
let isDown = false
let startX = 0
let startScrollLeft = 0
let lastSamples: Array<{ x: number; t: number }> = []

const pageCount = 2 // 当前只有两页，若扩展请动态计算

const onPointerDown = (e: PointerEvent) => {
  if (!scrollContainer.value) return
  // 如果点击目标位于交互元素内部（如 <a>），不要在容器上启动拖拽，保留链接默认行为
  const target = e.target as HTMLElement | null
  if (target && target.closest && target.closest('a,button,input,textarea,select,[role="button"]')) {
    return
  }
  isDown = true
  // 捕获指针以确保 move/up 能收到
  try { scrollContainer.value.setPointerCapture(e.pointerId) } catch {}
  startX = e.clientX
  startScrollLeft = scrollContainer.value.scrollLeft
  lastSamples = [{ x: e.clientX, t: performance.now() }]
  scrollContainer.value.classList.add('dragging')
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDown || !scrollContainer.value) return
  e.preventDefault()
  const dx = e.clientX - startX
  // 直接设置 scrollLeft，实现拖拽滚动
  scrollContainer.value.scrollLeft = startScrollLeft - dx
  lastSamples.push({ x: e.clientX, t: performance.now() })
  if (lastSamples.length > 6) lastSamples.shift()
}

const endDrag = (e?: PointerEvent) => {
  if (!scrollContainer.value) return
  if (!isDown) return
  const samples = lastSamples
  const last = samples[samples.length - 1] ?? { x: startX, t: performance.now() }
  const first = samples[0] ?? last
  const dt = Math.max(1, last.t - first.t) // ms
  const dx = last.x - first.x
  const pointerV = dx / dt // px per ms
  // 指针速度与滚动方向相反
  const scrollV = -pointerV
  // 计算惯性位移（经验值乘数），单位 px
  const momentum = scrollV * 300
  const el = scrollContainer.value
  let target = el.scrollLeft + momentum
  const pageW = el.clientWidth
  // 动态计算页数，防止硬编码
  const computedPageCount = Math.max(1, Math.round(el.scrollWidth / pageW))
  const targetPage = Math.round(target / pageW)
  const clamped = Math.max(0, Math.min(computedPageCount - 1, targetPage))
  // 使用平滑滚动到目标页，依赖浏览器的平滑行为
  el.scrollTo({ left: clamped * pageW, behavior: 'smooth' })
  isDown = false
  try { if (e) el.releasePointerCapture(e.pointerId) } catch {}
  el.classList.remove('dragging')
}

const onMouseLeave = () => { if (isDown) endDrag() }

onMounted(() => {
  const el = scrollContainer.value
  if (!el) return
  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', endDrag)
  el.addEventListener('pointercancel', endDrag)
  el.addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  const el = scrollContainer.value
  if (!el) return
  el.removeEventListener('pointerdown', onPointerDown)
  el.removeEventListener('pointermove', onPointerMove)
  el.removeEventListener('pointerup', endDrag)
  el.removeEventListener('pointercancel', endDrag)
  el.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<style scoped>
/* 隐藏滚动条但保留功能 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 拖拽时的视觉与交互优化 */
.dragging {
  cursor: grabbing !important;
  /* 避免拖动时选中文本 */
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

/* 禁用默认触摸横向滚动以便自定义拖拽工作更一致 */
.no-scrollbar {
  touch-action: pan-y;
}

/* 不可用卡片样式：hover 时变灰并显示 badge */
.card-unavailable .card-badge {
  opacity: 0;
}
.card-unavailable.group:hover .card-badge {
  opacity: 1;
}
.card-unavailable .w-10,
.card-unavailable span {
  transition: color .2s, opacity .2s;
}
.card-unavailable.group:hover .w-10,
.card-unavailable.group:hover span {
  color: rgba(255,255,255,0.4) !important;
  opacity: 0.6;
}

/* 之前实现的左下角阴影 */
.group:hover {
  box-shadow: -15px 15px 30px -5px rgba(0, 0, 0, 0.6);
}
</style>