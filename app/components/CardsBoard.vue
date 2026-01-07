<template>
  <div class="grid grid-cols-1 grid-rows-5 w-full h-full">
    <div class="row-span-1 hidden sm:block">
      <UCard
        :ui="{
          root: 'bg-background/50 backdrop-blur-sm min-h-5 transition-all ring-0',
          body: 'w-full h-full sm:py-2',
        }"
        class="rounded-full dark:shadow-[inset_0_2px_2px_0_rgba(255,255,255,0.1)] shadow-[inset_0_2px_2px_0_rgba(0,0,0,0.1)] h-1/2 w-full flex items-center border-b border-black mt-8"
      >
        <div class="flex w-full h-full items-center">
          <div
            class="flex-1 grid grid-cols-4 h-full items-center gap-2"
          >
            <!-- 图标 -->
            <UIcon
              name="i-heroicons-clock"
              class="h-[2em] w-[2em] col-span-1 -translate-x-2.5"
            />
            <!-- 时间 -->
            <div class="col-span-3 flex justify-center ml-2">
              <span
                class="font-['Inter'] text-xl font-medium tracking-tight"
              >
                {{ currentTime }}
              </span>
            </div>
          </div>
            <div class="ml-4 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] flex-4 flex h-full items-center justify-center px-4">
              <div class="flex items-center justify-center w-full">
                <p
                  class="font-['Allura'] text-[1.1em] font-bold text-white/90 text-center w-full translate-y-1"
                >
                  <template v-if="loading">加载中...</template>
                  <template v-else-if="error">暂无一句话 • 错误</template>
                  <template v-else>{{ sentence.slice(0,-1) }}</template>
                </p>
              </div>
            </div>
        </div>
      </UCard>
    </div>
    <div class="row-span-4 h-full w-full">
      <CardGroup />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sentence = ref('')
const loading = ref(false)
const error = ref('')

// 实时时钟（精确到秒）
const currentTime = ref('')
function updateTime() {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  currentTime.value = `${hh}:${mm}:${ss}`
}
let timerId: number | undefined

const API_URL = 'https://v1.hitokoto.cn/?c=a&max_length=16'

// 调用一言 API
async function fetchSentence() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('无法获取一句话')
    const data = await res.json() as any
    // API 返回字段通常是 { hitokoto: '...', from: '...', ... }
    sentence.value = String(data.hitokoto || data.content || data.sentence || '')
  } catch (e: any) {
    error.value = e?.message || String(e)
    sentence.value = ''
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 仅在客户端执行网络请求，避免 SSR 阻塞
  fetchSentence()
  // 启动实时时钟
  updateTime()
  timerId = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timerId !== undefined) clearInterval(timerId)
})
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Allura&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+SC:wght@100..900&display=swap');
</style>
