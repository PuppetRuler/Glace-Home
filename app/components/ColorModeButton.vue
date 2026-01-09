<template>
  <UButton
    :icon="currentIcon"
    variant="ghost"
    color="neutral"
    class="hover:bg-white/10 transition-none"
    @click="toggleColorMode"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isMounted = ref(false)

// 1. 手动定义 Cookie 存取，名称为 'color-mode'
const colorCookie = useCookie('color-mode', {
  path: '/',
  maxAge: 60 * 60 * 24 * 365
})

// 2. 统一图标判断逻辑
const getIcon = (mode: string | undefined | null) => {
  return mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'
}

// 3. 计算图标：SSR 阶段直接读 cookie，挂载后读插件状态
const currentIcon = computed(() => {
  // 如果已经挂载，使用插件的实时状态
  if (isMounted.value) {
    return getIcon(colorMode.value)
  }
  // SSR 或初始渲染阶段，强制读取手动设置的 cookie，默认为 'light'
  return getIcon(colorCookie.value || 'dark')
})

onMounted(() => {
  isMounted.value = true

  // 初始化校准：如果 cookie 还没存过，把当前模式存进去
  if (!colorCookie.value) {
    colorCookie.value = colorMode.value
  }
})

// 扩散动画切换逻辑
const toggleColorMode = (event: MouseEvent) => {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  )

  if (!document.startViewTransition) {
    const nextMode = colorMode.value === 'dark' ? 'light' : 'dark'
    colorMode.preference = nextMode
    colorCookie.value = nextMode // 同步更新手动 cookie
    return
  }

  const transition = document.startViewTransition(async () => {
    const nextMode = colorMode.value === 'dark' ? 'light' : 'dark'
    colorMode.preference = nextMode
    colorCookie.value = nextMode // 同步更新手动 cookie
    await nextTick()
  })

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: 450,
        easing: 'ease-out',
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}
</script>
