<template>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold flex flex-col justify-center items-center gap-4 z-0 opacity-50 select-none pointer-events-none">
    <span>{{ error.status }}</span>
    <span>{{ error.message }}</span>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

onMounted(async () => {
  // 导入三维模型库
  const THREE = await import('https://cdn.skypack.dev/three@0.136.0')
  // 导入轨道控制器
  const { OrbitControls } = await import('https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls')
  console.clear()
  // 创建场景
  const scene = new THREE.Scene()
  // 设置场景背景颜色
  scene.background = new THREE.Color(0x160016)

  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    60,
    innerWidth / innerHeight,
    1,
    1000
  )
  // 设置相机位置
  camera.position.set(0, 4, 21)

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer()
  // 设置渲染器大小
  renderer.setSize(innerWidth, innerHeight)
  // 将渲染器添加到页面
  document.body.appendChild(renderer.domElement)
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  })

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  // 开启阻尼效果
  controls.enableDamping = true
  // 禁用面板
  controls.enablePan = false
  // 创建全局uniform
  const gu = { time: { value: 0 } }
  // 创建点的大小数组和移动数组
  const sizes = []
  const shift: number[] = []

  // 创建移动函数
  const pushShift = () => {
    shift.push(
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
      (Math.random() * 0.9 + 1) * Math.PI * 0.1,
      Math.random() * 0.9 + 0.1
    )
  }

  // 创建点的顶点数组(中间的球体)
  const pts = Array.from({ length: 50000 }, () => {
    sizes.push(Math.random() * 1.5 + 0.5)
    pushShift()
    return new THREE.Vector3()
      .randomDirection()
      .multiplyScalar(Math.random() * 0.5 + 9.5)
  })

  // 添加更多的点（旁边围绕的）
  for (let i = 0; i < 100000; i++) {
    const r = 10
    const R = 40
    const rand = Math.pow(Math.random(), 1.5)
    const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r)
    pts.push(
      new THREE.Vector3().setFromCylindricalCoords(
        radius,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 2
      )
    )
    sizes.push(Math.random() * 1.5 + 0.5)
    pushShift()
  }

  const g = new THREE.BufferGeometry().setFromPoints(pts)
  g.setAttribute('sizes', new THREE.Float32BufferAttribute(sizes, 1))
  g.setAttribute('shift', new THREE.Float32BufferAttribute(shift, 4))

  // 创建点材质
  const m = new THREE.PointsMaterial({
    size: 0.125,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    onBeforeCompile: (shader: any) => {
      shader.uniforms.time = gu.time
      shader.vertexShader = `
        uniform float time;
        attribute float sizes;
        attribute vec4 shift;
        varying vec3 vColor;
        ${shader.vertexShader}
        `
        .replace(`gl_PointSize = size;`, `gl_PointSize = size * sizes;`)
        .replace(
          `#include <color_vertex>`,
          `#include <color_vertex>
            float d = length(abs(position)/vec3(40.,10.,40));
            d=clamp(d,0.,1.);
            vColor=mix(vec3(227.,155.,0.),vec3(100.,50.,255.),d)/255.;`
        )
        .replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
            float t = time;
            float moveT = mod(shift.x + shift.z * t,PI2);
            float moveS = mod(shift.y + shift.z * t,PI2);
            transformed += vec3(cos(moveS) * sin(moveT),cos(moveT),sin(moveS) * sin(moveT)) * shift.w;
        `
        )
      shader.fragmentShader = shader.fragmentShader
        .replace(
          `#include <common>`,
          `#include <common>
            varying vec3 vColor;`
        )
        .replace(
          `#include <clipping_planes_fragment>`,
          `#include <clipping_planes_fragment>
            float dist = length(gl_PointCoord.xy - 0.5);`
        )
        .replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, dist) );`
        )
    }
  })
  // 创建点云并添加至场景
  const p = new THREE.Points(g, m)
  p.rotation.order = 'ZYX'
  p.rotation.z = 0.2
  scene.add(p)
  // 创建时钟
  const clock = new THREE.Clock()
  // 渲染循环
  renderer.setAnimationLoop(() => {
    controls.update()
    const t = clock.getElapsedTime() * 0.5
    gu.time.value = t * Math.PI
    p.rotation.y = t * 0.05
    renderer.render(scene, camera)
  })
})
</script>

<style scoped lang="scss"></style>
