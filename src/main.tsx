  
import React from 'react'
import { render } from 'react-dom'
import { AppProvider, App } from './app'

render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('app')
)