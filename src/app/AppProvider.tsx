import React, { ReactNode } from 'react'
import { ColorModeProvider, ThemeProvider } from '@xstyled/styled-components'
import { GlobalStyle } from '../style/GlobalStyle'
import { theme } from '../style/theme'
import { Provider } from 'react-redux'
import { store } from './store'
import { RecoilRoot } from 'recoil'
import { FirebaseInitializer } from '../components/reactFirebase/FirebaseInitializer'

type ProviderProps = {
  children: ReactNode
}

export function AppProvider({ children }: ProviderProps) {
  return (
    <Provider store={store}>
      <RecoilRoot>
        <FirebaseInitializer />
        <ThemeProvider theme={theme}>
          <GlobalStyle />
            {children}
        </ThemeProvider>
      </RecoilRoot>
    </Provider>
  )
}