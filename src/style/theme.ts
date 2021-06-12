import { bootstrapTheme } from "../components/bootstrap"

export const theme = {
  ...bootstrapTheme,

  /**
   * fonts を 上書き
   */
  fonts: {
    sans: "'Noto Sans JP', sans-serif",
    system:
      'system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", "Meiryo", sans-serif',
  }
}

export type AppTheme = typeof theme
/*
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {
    demo?: unknown
  }
}
*/