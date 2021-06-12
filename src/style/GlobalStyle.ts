import { createGlobalStyle } from '@xstyled/styled-components'
import { bootstrapGlobalStyle } from '../components/bootstrap/'

export const GlobalStyle = createGlobalStyle`
  ${bootstrapGlobalStyle()}
`