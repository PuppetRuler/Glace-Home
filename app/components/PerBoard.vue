<template>
  <UCard
    :ui="{
      root: 'bg-[2b2b2b]/10 backdrop-blur-sm ring-0 transition-all duration-300 h-full w-full',
      body: 'flex flex-col items-center h-full',
    }"
    class="rounded-4xl shadow-[-10px_10px_15px_rgba(0,0,0,0.5),inset_-2px_2px_10px_rgba(255,255,255,0.5)] hover:scale-[1.01] h-full"
  >
    <div class="flex-3 w-full flex items-center gap-6 pl-10">
      <UAvatar
        src="/favicon.ico"
        class="w-30 h-30 lg:w-25 lg:h-40 ring-4 ring-white/10 shadow-2xl"
      />
      <div class="flex-1 flex flex-col justify-center items-center min-h-[40vh]">
        <h1
          class="font-['Allura'] px-4 py-4 
                /* 响应式字号 */
                text-5xl md:text-7xl lg:text-8xl 
                font-bold tracking-wider 
                
                /* --- 亮色模式 (默认)：深色渐变 --- */
                bg-linear-to-br from-zinc-900 via-zinc-700 to-zinc-400
                drop-shadow-[0_2px_5px_rgba(0,0,0,0.1)]

                /* --- 暗色模式：白色渐变 --- */
                dark:from-white dark:via-white/80 dark:to-white/20
                dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]

                /* 过度效果 */
                bg-clip-text text-transparent 
                w-fit transition-all duration-300"
        >
          glace
        </h1>
      </div>
    </div>

    <div class="flex-1 w-full flex gap-3 justify-center items-center border-t border-white/5">
  <UButton 
    icon="i-simple-icons-github" 
    variant="ghost" 
    color="neutral" 
    to="https://github.com/PuppetRuler" 
    target="_blank" 
  />
  
  <UButton 
    icon="i-ph-paper-plane-tilt-bold" 
    variant="ghost" 
    color="neutral" 
    to="https://t.me/sixty_three" 
    target="_blank" 
  />
  
  <UButton 
    icon="i-heroicons-envelope-20-solid" 
    variant="ghost" 
    color="neutral" 
    to="mailto:ziyelixiang@gmail.com" 
    target="_blank" 
  />
</div>
  </UCard>
</template>

<script setup lang="ts"></script>
  
<style scoped lang="sass"></style>
