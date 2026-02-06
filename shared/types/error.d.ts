declare module 'https://cdn.skypack.dev/three@0.136.0' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const THREE: any
  export = THREE // 使用 export = 处理 CommonJS/ESM 混合情况
}

// 匹配扩展库 URL
declare module 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const OrbitControls: any
}
