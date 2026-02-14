<template>
  <div class="w-full mx-auto">
    <UCard
      :ui="{
        // 维持 2:1 左右的比例，减小圆角以适配整体 UI
        root: 'relative overflow-hidden bg-background/50 backdrop-blur-sm dark:shadow-[inset_2px_2px_2px_0_rgba(255,255,255,0.2),2px_2px_2px_0_rgba(0,0,0,0.2)] shadow-[inset_2_2px_2px_0_rgba(0,0,0,0.2),2px_2px_2px_0_rgba(255,255,255,0.2)] ring-0',
        body: 'p-0! aspect-9/5 flex flex-row'
      }"
      class="rounded-2xl border-b border-black shadow-2xl"
    >
      <div class="w-50 relative flex items-center justify-center overflow-hidden border-r border-white/5">
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            v-for="i in 3"
            :key="i"
            class="absolute rounded-full border border-white/10 animate-water-ripple"
            :style="{
              width: '90px',
              height: '90px',
              animationDelay: `${i * 1.5}s`
            }"
          />
        </div>

        <div class="relative z-10">
          <div class="absolute inset-0 bg-white/10 blur-2xl scale-125 rounded-full" />
          <UAvatar
            src="/favicon.ico"
            class="w-28 h-28 rounded-full ring-2 ring-white/40 shadow-2xl object-cover relative z-10"
          />
        </div>
      </div>

      <div class="flex-1 flex flex-col p-8 items-center justify-between bg-white/1">
        <div class="flex flex-col items-center">
          <h1 class="font-['Allura'] text-5xl text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            glace
          </h1>
          <div class="flex items-center gap-4 mt-2">
            <span class="h-px w-6 bg-white/60" />
            <p class="text-[10px] tracking-[0.6em] font-light uppercase italic">
              Developer
            </p>
            <span class="h-px w-6 bg-white/60" />
          </div>
        </div>

        <div class="w-full text-center">
          <p class="text-[11px] text-(--text-color) font-serif italic leading-relaxed tracking-[0.15em] mx-auto max-w-60">
            "时间如水，流过指尖的唯有此间清晨"
          </p>
        </div>

        <div class="flex w-full justify-around items-center px-4">
          <UButton
            v-for="link in socialLinks"
            :key="link.icon"
            :icon="link.icon"
            variant="ghost"
            class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white ring-1 ring-white/10 transition-all duration-300 shadow-sm"
            :to="link.url"
            target="_blank"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const socialLinks = [
  { icon: 'i-simple-icons-github', url: 'https://github.com/PuppetRuler' },
  { icon: 'i-ph-paper-plane-tilt-bold', url: 'https://t.me/sixty_three' },
  { icon: 'i-heroicons-envelope-20-solid', url: 'mailto:ziyelixiang@gmail.com' }
]
</script>

<style scoped>
/* 涟漪动画保持 */
@keyframes water-ripple {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(4.2); opacity: 0; }
}

.animate-water-ripple {
  animation: water-ripple 5s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
}

/* 玻璃噪点增强细节 */
:deep(.backdrop-blur-2xl) {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
}

h1 {
  -webkit-font-smoothing: antialiased;
}
</style>
