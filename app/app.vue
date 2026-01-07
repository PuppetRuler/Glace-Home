<template>
  <UApp>
    <div class="relative min-h-screen">
  <div ref="bgLayer" :class="['fixed inset-0 z-[-1] bg-layer', { 'bg-loaded': isLoaded }]">
          <!-- 模糊占位层（base64 数据） -->
          <div class="bg-blur" aria-hidden="true"></div>

          <!-- 真实背景层，加载前透明，加载后淡入 -->
          <div class="bg-real" aria-hidden="true"></div>
        </div>

      <div
        class="fixed inset-0 z-[-1] vignette-overlay backdrop-saturate-150"
      ></div>

      <div class="relative z-10">
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>

<style>
/* 确保 body 没有任何边距，防止背景出现白边 */
body {
  margin: 0;
  padding: 0;
}

/* 遮罩层：中心浓郁、向外围淡出 */
.vignette-overlay {
  pointer-events: none;
  position: fixed;
  inset: 0;

  /* 默认变量（亮色模式）：对应淡白色/淡灰色 */
  
  
  background-image: radial-gradient(
    ellipse at center, 
    rgba(var(--bg-gradient-home), 0.25) 0%, 
    rgba(var(--bg-gradient-home), 0.85) 150%
  );
  
  transition: background 300ms ease;
}

/* 深色模式：切换 RGB 数值 */
.dark .vignette-overlay {
  --bg-gradient-home: 20, 20, 20;
}
@media (prefers-reduced-motion: reduce) {
  .vignette-overlay { transition: none; }
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 真实图片加载状态
const isLoaded = ref(false)
const bgLayer = ref<HTMLElement | null>(null)

onMounted(() => {
  // 使用 Image 预加载真实背景图
  const img = new Image()
  // 真实图片地址
  img.src = '/bg.jpg'
  img.decoding = 'async'
  img.onload = () => {
    isLoaded.value = true
    // 当图片加载好后，把真实图作为背景图应用到 .bg-real
      if (bgLayer.value) {
      const realEl = bgLayer.value.querySelector('.bg-real') as HTMLElement | null
      if (realEl) realEl.style.backgroundImage = `url('${img.src}')`
    }
  }
})
</script>

<style>
/* 背景层：包含模糊占位与真实背景 */
.bg-layer { position: fixed; inset: 0; z-index: -1; pointer-events: none; }

/* 模糊占位，使用 provided base64 数据作为默认背景 */
.bg-blur {
  position: absolute; inset: 0; background-size: cover; background-position: center;
  /* base64 tiny image placeholder（模糊） */
  background-image: var(--bg-image, url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAASCAYAAAA6yNxSAAAJcklEQVR4AQCBAH7/AJyKav+kkXH/sZ5+/8Gujv/Svp7/4Myr/+rWtf/v2rj/7di2/+jSsP/hyqj/2sOh/9a/nf/Vvpz/2cKh/+DJqP/n0rH/7tm5//Hdvv/v3L7/6da6/97Nsv/Swqj/x7ig/7+ym/++spz/w7mj/87EsP/c1MD/6+PQ//jw3f//9+X/AIEAfv8AnIpr/6ORcv+wnn//wa6O/9K/n//hza3/69e2//Dbuv/v2bj/6dSy/+LMqv/bxaP/18Cf/9bAnv/Zw6L/4Mqp/+fSsv/t2bn/8Ny+/+7bvv/n1rr/3cyx/9DBqP/FuJ//vrKb/72ynP/CuKP/zcSw/9vTwP/q49D/9u/d//325P8AgQB+/wCci2z/o5Jz/7CfgP/Br5D/0sCh/+HOr//s2Ln/8d29//DcvP/s17b/5M+u/93Ip//Zw6L/2MKi/9rFpf/gy6v/59Kz/+zYuv/u277/7Nq+/+XUuf/ay7H/zsCn/8O2n/+8sZr/u7Gc/8C3o//Lw7D/2dK//+jhz//07tz/+vXj/wCBAH7/AJuKbf+ikXT/r56B/8Cvkv/SwKP/4tCx/+3avP/y38H/89/A/+7au//n07T/4Mys/9vHp//axab/28eo/+DMrv/m0rT/6te6/+vavv/p2L3/4dK4/9fJsP/Lvqf/wLWf/7mwmv+4sJz/vbaj/8jCr//W0L//5N/P//Ds2//38+L/AIEAfv8AmYlu/6CQdf+unoL/v6+T/9HApP/h0LT/7dy///ThxP/04sT/8d7A/+rXuf/j0LL/3sqt/9zIqv/cyaz/4M2w/+TStv/o1rv/6Ni9/+XWvP/d0Lf/08ev/8e8pv+9tJ7/t66b/7WvnP+6taP/xcCv/9LPv//g3c7/7Ona//Lw4f8AgQB+/wCWh27/nY51/6ucgv+8rZP/z7+l/+DPtf/s3MH/9OLH//XkyP/y4MT/7Nq+/+bTt//gzrH/3cuv/93Lr//fzrP/4tK3/+XVu//l1r3/4dS8/9rOtv/Pxa//xLum/7qyn/+0rpv/s66d/7i0pP/Cv7D/z82+/9zbzf/n59n/7e3f/wCBAH7/AJKEbP+ai3P/p5mB/7mqkv/MvaT/3c60/+rawf/y4sj/9eTK//Pix//t3ML/59a7/+HQtf/ezbL/3cyy/97OtP/g0bj/4tS7/+HUvf/d0rv/1sy2/8zDr//Buqb/uLKg/7KunP+xrp7/trSl/7++sP/Ly77/19nM/+Lk1//o6t3/AIEAfv8AjoBq/5aIcf+jlX7/taaP/8i5ov/ZyrP/59jA//DgyP/z48r/8uHI/+3dw//n1r3/4dG4/97OtP/czbT/3c61/97QuP/f0rv/3tK8/9rQuv/Tyrb/ysKv/8C6qP+3s6H/sa6e/7CvoP+0tKb/vL6w/8jKvf/T1sr/3eDV/+Lm2v8AgQB+/wCKfGf/koRu/5+Re/+wooz/w7Se/9XGr//j1L3/7N3G//Dgyf/w4Mj/7NvD/+bWvv/h0bj/3c21/9vMtP/bzbX/3M+4/93Ruv/c0bv/2M+6/9HKtv/Jw7D/v7up/7e0o/+xsKH/sLCi/7O1p/+6vbH/xMi8/8/TyP/X3NL/3OLX/wCBAH7/AId5Zf+OgGz/m414/6ydif+/sJv/0MGr/97Puf/o2ML/7dzG/+3cxf/p2cL/5NS8/9/PuP/bzLT/2cqz/9nLtP/azbf/28+5/9rQu//Xzrr/0cq2/8nDsf/AvKv/uLam/7Kyo/+xsqT/s7Wo/7m9sf/Bxrv/ytDF/9LYzf/W3dL/AIEAfv8AhnZj/419af+ZiXb/qZmF/7url//MvKf/2sq0/+TTvf/p2ML/6djC/+bVvv/h0br/3c21/9nJsv/XyLL/18mz/9jLtf/Zzrj/2c+6/9bOuv/Ryrf/ysWz/8K/rv+6uan/tLWm/7K0pv+ztqn/t7yw/77EuP/GzMH/zNPI/8/XzP8AgQB+/wCGdmL/jHxo/5iHdP+ol4P/uaiT/8m4o//WxbD/4M65/+XTvf/l1L3/49G7/9/Ntv/aybL/18ew/9bGr//Wx7H/18q0/9jNt//Zzrn/1866/9PMuf/Mx7X/xcGw/728q/+3t6j/s7Wn/7O3qf+2u67/u8G1/8HHvP/FzcL/yNDF/wCBAH7/AIh2Y/+OfGn/mYdz/6iWgf+4pZH/x7Sg/9TBrP/dyrT/4c+4/+LPuf/gzbb/3Mqz/9jGr//VxK3/1MSt/9XGr//WybL/2My2/9nOuf/Yz7v/1c26/8/Kt//IxLP/wL+u/7q6qv+1t6j/s7ep/7S5rP+3vbH/u8K2/7/Gu//Byb3/AIEAfv8AjHll/5J+av+ciHT/qZaB/7ikkP/Gsp3/0r6p/9vGsP/fy7T/4My1/97Ksv/ax6//1sOs/9TCqv/Twqr/1MSs/9bHsP/Zy7X/2s+5/9rQu//Xz7v/0sy5/8vHtf/EwbD/vLys/7e4qf+ztqj/s7ep/7S5rP+2vLD/uL+z/7rBtf8AgQB+/wCRfGj/loFt/6CLdv+sl4L/uqWP/8eynP/SvKb/2sSt/97Isf/eybH/3Mev/9jErP/Vwan/08Cn/9LAqP/Uw6v/1sev/9nLtP/cz7n/3NG8/9rRvP/Vz7r/zsq3/8fEsv+/vq3/uLmp/7O2p/+xtab/sLWn/7G3qv+yuaz/s7qt/wCBAH7/AJaAa/+bhHD/o414/6+Zg/+8pZD/yLKb/9K8pf/Zw6v/3cav/93Hr//bxaz/18Kp/9S/pv/SvqX/0r+m/9TCqf/Xxq7/2su0/93Quf/e07z/3NO9/9jQvP/RzLj/ycaz/8G/rf+5uaj/s7Wl/6+zo/+tsqP/rbKk/62zpf+ttKb/AIEAfv8AmoNu/56Hcv+nj3r/spqF/76mkP/Jspv/07uk/9nCqv/cxa3/3cWt/9rDq//Xwaf/1L6l/9K9pP/SvqX/1MGo/9fGrf/bzLP/3tC5/9/TvP/e1L7/2tK9/9PNuf/Lx7T/wsCu/7q6qP+ztKT/rrGh/6uvoP+pr6D/qa+h/6mvof8BgQB+/wCchG//oIlz/6iRe/+zm4X/v6eR/8qym//Tu6T/2cGq/9zFrP/cxaz/2sOq/9fAp//UvqT/0r2j/9K+pP/Uwaj/18at/9vMs//f0bn/4NS9/9/Vvv/b073/1M65/8zItP/CwK7/urqo/7O0o/+tsKD/qq6e/6itnv+nrZ7/p62e/8DiPuDx0fjZAAAAAElFTkSuQmCC'));
  filter: blur(12px) saturate(1.05);
  transform: scale(1.03);
}

/* 真实背景层，初始透明，加载完成后通过 .loaded 类淡入 */
.bg-real {
  position: absolute; inset: 0; background-size: cover; background-position: center;
  opacity: 0; transition: opacity 900ms ease-in-out; will-change: opacity;
}

/* 当 body 或根节点含 .bg-loaded 时，淡入真实背景并降低模糊强度 */
:root .bg-layer.bg-loaded .bg-real { opacity: 1; }
:root .bg-layer.bg-loaded .bg-blur { filter: blur(6px) saturate(1); opacity: 0.65; }

</style>
