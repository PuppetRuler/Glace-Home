declare module 'https://cdn.skypack.dev/three@0.136.0' {

  const THREE: any
  export = THREE // 使用 export = 处理 CommonJS/ESM 混合情况
}

// 匹配扩展库 URL
declare module 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls' {

  export const OrbitControls: any
}
