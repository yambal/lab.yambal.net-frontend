export const theme = {
  font: {
    base: "'Noto Sans JP', sans-serif",
    system:
      'system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", "Meiryo", sans-serif',
  },

  fontSizes: {
    base: '1rem',
    h6: '1rem',
    h5: '1.25rem',
    h4: 'calc(1.275rem + .3vw)',
    h3: 'calc(1.3rem + .6vw)',
    h2: 'calc(1.325rem + .9vw)',
    h1: 'calc(1.375rem + 1.5vw)',
  },

  fontWeight: {
    base: 400,
    bold: 500
  },

  lineHeights: {
    headingsLineHeight: '1.2rem',
    base: '1.5rem'
  },

  colors: {
    inherit: 'inherit',
    bodyColor: '#212529',
    bodyBg: '#FFFFFF'
  },

  spaces: {
    s05: '0.5rem',
    s10: '1rem'
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