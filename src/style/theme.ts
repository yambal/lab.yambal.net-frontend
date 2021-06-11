export const theme = {
  colors: {
    bg: '#F7FAFC',
    bgAlt: '#213B60',
    fg: '#425269',
    fgAlt: '#FFF',
    line: '#557799',
    lineSection: '#DFEAF2',
    title: '#596682',
    caption: '#8298AB',
    link: '#425269',
    normal: '#FFF',
    primary: '#7DB5A0',
    alert: '#F1516F',
    calendarBg: '#7DB5A0',
    calendarBgActive: '#40B287',
    calendarBgDisabled: '#6D7278',
    calendarBgAlt: '#FFF',
    calendarLine: '#DEDEDE',
    calendarLineAlt: '#7DB5A0',
    inputBg: '#FFF',
    inputLine: '#BFCED9',
    inputPlaceholder: '#9DACBB',
    videoBg: '#425269',
  },

  lineHeights: {
    xsmall: 1.0,
    small: 1.45,
    normal: 1.5,
  },

  fonts: {
    sans: 'Noto Sans JP', // NotoSansCJKjp
    serif: 'Noto Serif JP', // NotoSerifCJKjp
  },

  fontSizes: {
    xsmall: '11rpx',
    small: '12rpx',
    normal: '13rpx',
    medium: '14rpx',
    large: '20rpx',
    xlarge: '30rpx',
    xxlarge: '40rpx',
  },

  radii: {
    normal: '4rpx',
  },

  space: {
    s0: 0,
    s1: '4rpx',
    s2: '8rpx',
    s3: '12rpx',
    s4: '16rpx',
    s5: '20rpx',
    s6: '24rpx',
    s7: '28rpx',
    s8: '32rpx',
    s9: '36rpx',
    s10: '40rpx',
    s11: '44rpx',
    s12: '48rpx',
    s13: '52rpx',
    s14: '56rpx',
    s15: '60rpx',
    s16: '64rpx',
    s17: '68rpx',
    s18: '72rpx',
    s19: '76rpx',
    s20: '80rpx',
  },
}

export type AppTheme = typeof theme
/*
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {
    demo?: unknown
  }
}
*/