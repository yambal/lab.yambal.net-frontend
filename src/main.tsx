import {} from "react-dom/experimental"  
import React from 'react'
import ReactDOM, { render } from 'react-dom/'
import { AppProvider, App } from './app'

/*
render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('app')
)
*/
ReactDOM.createRoot(document.getElementById('app')).render(
  <AppProvider>
    <App />
  </AppProvider>
);
