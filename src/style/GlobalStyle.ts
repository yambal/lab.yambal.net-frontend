import { createGlobalStyle } from '@xstyled/styled-components'
import { normalize } from 'polished'

export const GlobalStyle = createGlobalStyle`
  ${normalize()}

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    font-size: 16px;
    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }
  
  body {
    margin: 0;
    font-family: ${props => props.theme.font.base}, ${props => props.theme.font.system};
    font-size: ${props => props.theme.fontSizes.base};
    font-weight: ${props => props.theme.fontWeight.base};
    line-height: ${props => props.theme.lineHeights.base};
    color: ${props => props.theme.colors.bodyColor};
    background-color: ${props => props.theme.colors.bodyBg};
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  hr {
    height: 1px;
    margin: ${props => props.theme.spaces.s10} 0;
    color: ${props => props.theme.colors.inherit};
    background-color: ${props => props.theme.colors.bodyColor};
    border: 0;
    opacity: .25;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: ${props => props.theme.spaces.s05};
    font-weight: ${props => props.theme.fontWeight.bold};
    line-height: ${props => props.theme.lineHeights.headingsLineHeight};
    color: ${props => props.theme.colors.bodyColor};
  }

  h1 {
      font-size: ${props => props.theme.fontSizes.h1};
  }

  h2 {
    font-size: ${props => props.theme.fontSizes.h2};
  }

  h3 {
    font-size: ${props => props.theme.fontSizes.h3};
  }

  h4 {
    font-size: ${props => props.theme.fontSizes.h4};
  }

  h5 {
    font-size: ${props => props.theme.fontSizes.h5};
  }

  h6 {
    font-size: ${props => props.theme.fontSizes.h6};
  }

  p {
    margin-top: 0;
  }
  
`