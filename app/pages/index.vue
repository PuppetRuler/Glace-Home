<template>
  <UContainer class="min-h-screen flex flex-col pt-3">
    <Header />
    <UMain class="flex-1 grid lg:grid-cols-5 items-center min-h-0">
      <div class="lg:col-span-2 mt-4 sm:mt-0 lg:h-4/5 min-h-40">
        <PerBoard class="flex flex-col items-center space-y-6" />
      </div>
      <div class="lg:col-span-3 h-full flex justify-center items-center sm:px-[10%] min-h-0 overflow-hidden">
        <CardsBoard class="pt-10 " />
      </div>
    </UMain>
  </UContainer>
</template>

<script setup lang="ts"></script>
