import React from 'react'
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link 
} from 'react-router-dom'

export const HomeContainer = () => {
  return <div>
      <h1>Hello 2</h1>
      <Link to="/counter">Counter</Link>
    </div>
}