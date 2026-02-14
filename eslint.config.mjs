// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // 1. 允许在一行中写多个语句（例如单行 try-catch）
      '@stylistic/max-statements-per-line': 'off',

      // 2. 允许空块（no-empty），或者更建议：仅允许空的 catch 块
      'no-empty': ['error', { allowEmptyCatch: true }],

      // 不处理空函数的报错
      '@typescript-eslint/no-empty-function': 'off',

      // <script> 中看到 <T> 时，不会将其误报为非法标签名
      'vue/no-parsing-error': ['error', {
        'invalid-first-character-of-tag-name': false
      }],
      // 关闭“Transition 内部必须有 v-if/v-show”的检查
      'vue/require-toggle-inside-transition': 'off',

      // 将 TypeScript 的 any 检查降级为警告或直接关闭
      '@typescript-eslint/no-explicit-any': 'off',

      // 允许定义未使用的变量，或者仅警告
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
)
