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
            <UIcon
              name="i-heroicons-clock"
              class="h-[2em] w-[2em] col-span-1 -translate-x-2.5"
            />
            <div class="col-span-3 flex justify-center">
              <span
                class="font-['Inter'] text-2xl font-medium tracking-tight"
              >
                12:00
              </span>
            </div>
          </div>
          <div class="rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] flex-4 flex h-full items-center justify-center">
            <p
              class="truncate font-['Allura'] text-[1em] font-bold text-white/90 translate-y-px"
            >
              哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇哇
            </p>
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

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Allura&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+SC:wght@100..900&display=swap');
</style>
