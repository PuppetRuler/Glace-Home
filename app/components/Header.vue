<template>
  <UHeader
    class="header rounded-full my-2 dark:shadow-[inset_0_2px_2px_0_rgba(255,255,255,0.1)] shadow-[inset_0_2px_2px_0_rgba(0,0,0,0.1)]"
  >
    <template #left>
      <Logo class="h-[80] w-auto" />
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

<style scoped>
.header {
  width: 80%;
}
</style>
