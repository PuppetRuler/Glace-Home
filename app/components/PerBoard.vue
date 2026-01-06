<template>
  <UCard
    :ui="{
      root: 'bg-[2b2b2b]/10 backdrop-blur-sm ring-0 transition-all duration-300 h-full w-full',
      body: 'flex flex-col items-center h-full p-6',
    }"
    class="rounded-4xl shadow-[-10px_10px_15px_rgba(0,0,0,0.5),inset_-2px_2px_10px_rgba(255,255,255,0.5)] hover:scale-[1.01] h-full"
  >
    <div class="flex-3 w-full flex items-center gap-6">
      <UAvatar
        src="/favicon.ico"
        class="w-30 h-30 lg:w-25 lg:h-40 ring-4 ring-white/10 shadow-2xl"
      />
      <div class="flex-1 flex flex-col justify-center items-center min-h-[40vh]">
  <h1
    class="font-['Allura'] px-4 py-4 
           /* 手机端默认大小，平板 md，桌面 lg */
           text-5xl md:text-7xl lg:text-8xl 
           font-bold tracking-wider 
           bg-linear-to-br from-white via-white/80 to-white/20 bg-clip-text text-transparent 
           drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] w-fit"
  >
    glace
  </h1>
</div>
    </div>

    <div
      class="flex-1 w-full flex gap-3 justify-center items-center border-t border-white/5"
    >
      <UButton icon="i-simple-icons-github" variant="ghost" color="neutral" />
      <UButton icon="i-heroicons-envelope" variant="ghost" color="neutral" />
      <UButton icon="i-simple-icons-x" variant="ghost" color="neutral" />
    </div>
  </UCard>
</template>

<script setup lang="ts"></script>
  
<style scoped lang="sass">
  @import url('https://fonts.googleapis.com/css2?family=Allura&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
</style>
