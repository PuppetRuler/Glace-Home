<template>
  <UHeader
    class="rounded-full dark:shadow-[inset_0_2px_2px_0_rgba(255,255,255,0.1)] shadow-[inset_0_2px_2px_0_rgba(0,0,0,0.1)]"
  >
    <template #left>
      <div class="flex items-center gap-3">
        <Logo class="h-10 w-auto" />
        <h1 class="text-base font-bold tracking-tight text-white/90">
          Glace's Home
        </h1>
      </div>
    </template>
    <template #right>
      <UButton
        icon="i-simple-icons-github"
        label="GitHub"
        to="https://github.com/PuppetRuler"
        target="_blank"
        variant="ghost"
        color="neutral"
        class="hover:bg-white/10"
      />
      <UColorModeButton class="hover:bg-white/10" />
    </template>
  </UHeader>
</template>

<script setup lang="ts"></script>

<<<<<<< HEAD
<style scoped></style>
=======
<style scoped>
</style>
>>>>>>> 7653c635db094adc083f18b031b129cbc0481c16
