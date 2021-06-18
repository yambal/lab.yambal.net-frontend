import React, { ReactNode } from 'react'
import { ColorModeProvider, ThemeProvider } from '@xstyled/styled-components'
import { GlobalStyle } from '../style/GlobalStyle'
import { theme } from '../style/theme'
import { Provider } from 'react-redux'
import { store } from './store'
import { SkywayRoot } from '../components/skyWay/SkywayRoot'

type ProviderProps = {
  children: ReactNode
}



export function AppProvider({ children }: ProviderProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SkywayRoot apiKey="42f75ed0-a9ff-4f07-ad83-cecc2daa274c">
          <GlobalStyle />
            {children}
        </SkywayRoot>
      </ThemeProvider>
    </Provider>
  )
}