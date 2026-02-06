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
  const { OrbitControls }
    = await import('https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls')
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
  // 监视窗口大小变化事件
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
  const gu = {
    time: { value: 0 }
  }
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
  // 创建一个长度为5万的数组pts并用Array.prototype.map()方法遍历数组并对每个元素进行操作
  const pts = Array.from({ length: 50000 }, () => {
    // 每次遍历中，会向sizes数组中添加一个随机大小
    sizes.push(Math.random() * 1.5 + 0.5)
    // 调用pushShift()函数添加位置信息，并返回一个随机方向的THREE.Vector对象
    pushShift()
    return new THREE.Vector3()
      .randomDirection()
      .multiplyScalar(Math.random() * 0.5 + 9.5)
  })

  // 添加更多的点（旁边围绕的）
  // 先循环生成十万个点
  // 每次循环中生成一个随机数rand,再生成一个随机半径radius
  for (let i = 0; i < 100000; i++) {
    const r = 10,
      R = 40
    const rand = Math.pow(Math.random(), 1.5)
    const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r)
    // 使用new THREE.vector3().setFormCylindericalCoords()生成一个点
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
  // 生成一个点g,同时将点的大小和位置信息添加到sizes和shift数组中
  const g = new THREE.BufferGeometry().setFromPoints(pts)
  // 创建了一个缓冲几何体并设置size和shift属性
  g.setAttribute('sizes', new THREE.Float32BufferAttribute(sizes, 1))
  g.setAttribute('shift', new THREE.Float32BufferAttribute(shift, 4))
  // 创建点材质
  const m = new THREE.PointsMaterial({
    // 表示点的大小
    size: 0.125,
    // 设置材质为透明
    transparent: true,
    // 表示禁用深度测试，使点可以叠加
    depthTest: false,
    // 使用假发混合模式
    blending: THREE.AdditiveBlending,
    // 在材质编译之前修改颜色器，在这里，它用来替换顶点着色器和片元着色器，添加uniform
    // 和attribute,以及自定义颜色和移动
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBeforeCompile: (shader: any) => {
      shader.uniforms.time = gu.time
      // 首先，它为着色器设置了一个uniform变量time,该变量是在点材质中定义的，用来追踪时间
      // 然后它定义了两个attribute变量sizes和shift,这两个变量是在缓冲几何体中定义的，用来存储点的大小和移动信息
      // 最后使用replace方法来替换顶点看色器中的代码
      shader.vertexShader = `
        uniform float time;
        attribute float sizes;
        attribute vec4 shift;
        varying vec3 vColor;
        ${shader.vertexShader}
        `
        // 使用replace来替换着色器中的代码
        // 更新点的大小
        .replace(`gl_PointSize = size;`, `gl_PointSize = size * sizes;`)
        // 更新点的颜色
        .replace(
          `#include <color_vertex>`,
          `#include <color_vertex>
            float d = length(abs(position)/vec3(40.,10.,40));
            d=clamp(d,0.,1.);
            vColor=mix(vec3(227.,155.,0.),vec3(100.,50.,255.),d)/255.;`
        )
        // 更新点的移动
        .replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
            float t = time;
            float moveT = mod(shift.x + shift.z * t,PI2);
            float moveS = mod(shift.y + shift.z * t,PI2);
            transformed += vec3(cos(moveS) * sin(moveT),cos(moveT),sin(moveS) * sin(moveT)) * shift.w;
        `
        )
      // 修改片元着色器，用来让点的边缘更加圆滑

      // 首先，定义一个varying变量vColor,这个变量是在顶点着色器中定义的，用来传递点的颜色到片段着色器
      // 然后使用replace方法来替换片段着色器的代码
      shader.fragmentShader = shader.fragmentShader
        // 将变量注入到公共区域，确保它在 #version 声明之后
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
        // 替换最终的颜色输出
        .replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, dist) );`
        )
    }
  })
  // ---------------------------------------------------------------
  // 创建点云并添加至场景，设置渲染循环
  const p = new THREE.Points(g, m)
  // 旋转顺序是"ZYX"
  p.rotation.order = 'ZYX'
  // 旋转角度 0.2
  p.rotation.z = 0.2
  // 把对象 (p) 添加至场景
  scene.add(p)
  // 创建一个时钟clock
  const clock = new THREE.Clock()
  // 渲染循环函数,每次循环中会更新控制器，更新时间
  renderer.setAnimationLoop(() => {
    // 更新控制器
    controls.update()
    // 获取时钟对象的已流逝时间(t)并乘0.5
    const t = clock.getElapsedTime() * 0.5
    // 将gu.time.value设置为t*Math.PI
    gu.time.value = t * Math.PI
    // 将对象p的旋转角度y设置为t*0.05
    p.rotation.y = t * 0.05
    // 渲染场景和相机
    renderer.render(scene, camera)
  })
})
</script>

<style scoped lang="scss"></style>
