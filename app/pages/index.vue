<template>
  <UContainer class="min-h-screen flex flex-col pt-3">
    <Header />
    <UMain class="flex-1 grid lg:grid-cols-5 items-center min-h-0">
      <!-- 左侧：PerBoard 或其骨架 -->
      <div class="lg:col-span-2 mt-4 sm:mt-0 lg:h-4/5 min-h-40">
        <template v-if="loading">
          <div class="p-6 w-full flex flex-col items-center space-y-4">
            <div class="skeleton h-6 w-3/4 rounded"></div>
            <div class="skeleton h-40 w-full rounded"></div>
            <div class="flex space-x-3 w-full justify-center mt-2">
              <div class="skeleton h-10 w-24 rounded"></div>
              <div class="skeleton h-10 w-24 rounded"></div>
              <div class="skeleton h-10 w-24 rounded"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <PerBoard class="flex flex-col items-center space-y-6" />
        </template>
      </div>

      <!-- 右侧：CardsBoard 或其骨架 -->
      <div class="lg:col-span-3 h-full flex justify-center items-center sm:px-[10%] min-h-0 overflow-hidden">
        <template v-if="loading">
          <div class="w-full pt-10 space-y-6">
            <div class="skeleton h-8 w-1/3 rounded mx-auto"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="n in 6" :key="n" class="skeleton-card p-4 rounded">
                <div class="skeleton h-36 w-full rounded"></div>
                <div class="mt-4">
                  <div class="skeleton h-4 w-3/4 rounded mb-2"></div>
                  <div class="skeleton h-3 w-1/2 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <CardsBoard class="pt-10" />
        </template>
      </div>
    </UMain>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 简单加载状态：可以在未来替换为真实的数据加载逻辑或由子组件触发
const loading = ref(true)

onMounted(() => {
  // 给出一个最小的骨架显示时间以避免闪烁
  const minSkeletonMs = 350
  setTimeout(() => (loading.value = false), minSkeletonMs)
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.02) 37%, rgba(0,0,0,0.06) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}
.skeleton-card { background: transparent; }

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
</style>
