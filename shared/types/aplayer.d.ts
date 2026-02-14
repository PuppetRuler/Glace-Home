// aplayer.d.ts
declare module 'aplayer' {
  interface APlayerOptions {
    container: HTMLElement | null
    fixed?: boolean
    mini?: boolean
    autoplay?: boolean
    theme?: string
    loop?: 'all' | 'one' | 'none'
    order?: 'list' | 'random'
    preload?: 'auto' | 'metadata' | 'none'
    volume?: number
    audio: Array<{
      name: string
      artist: string
      url: string
      cover: string
      lrc?: string
      theme?: string
      type?: string
    }>
    customAudioType?: any
    listFolded?: boolean
    listMaxHeight?: string
    storageName?: string
    lrcType?: number
  }

  class APlayer {
    constructor(options: APlayerOptions)
    play(): void
    pause(): void
    toggle(): void
    seek(time: number): void
    switchAudio(index: number): void
    volume(percentage: number, nostorage: boolean): void
    setMode(mode: string): void
    destroy(): void
    on(event: string, handler: () => void): void
    skipBack(): void
    skipForward(): void
    list: {
      show(): void
      hide(): void
      toggle(): void
      add(audios: any): void
      remove(index: number): void
      switch(index: number): void
      clear(): void
      index: number
      audios: any[]
    }

    audio: HTMLAudioElement
  }

  export default APlayer
}
