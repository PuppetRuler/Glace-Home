<template>
  <UContainer class="flex flex-col lg:max-h-screen pt-1">
    <Header />
    <UMain class="flex-1 grid lg:grid-cols-5 items-center">
      <div class="lg:col-span-2 h-4/5">
        <PerBoard class="flex flex-col items-center space-y-6" />
      </div>
      <div class="lg:col-span-3 h-full flex  justify-center items-center px-[10%]">
        <CardsBoard class="py-10 " />
      </div>
    </UMain>
  </UContainer>
</template>

<script setup lang="ts"></script>
