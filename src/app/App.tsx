
import React from 'react'
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link 
} from 'react-router-dom'
import { CounterContainer } from '../features/counter/CounterContainer'
import { HomeContainer } from '../features/home/ComeContainer'

export const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/counter" component={() => <CounterContainer />} />
        <Route path="/" component={() => <HomeContainer />} />
      </Switch>
    </Router>
  )
}