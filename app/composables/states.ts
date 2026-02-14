// composables/states.ts

// 播放状态
export const usePlayState = () => useState<boolean>('playState', () => false)

// 播放器显示/隐藏
export const usePlayerShow = () => useState<boolean>('playerShow', () => true)

// 播放器音量
export const usePlayerVolume = () => useState<number>('playerVolume', () => 0.7)

// 当前歌曲信息
export const usePlayerData = () => useState<{ name: string, artist: string }>('playerData', () => ({
  name: '未知曲目',
  artist: '未知艺术家'
}))
