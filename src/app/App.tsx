
import React from 'react'
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link 
} from 'react-router-dom'
import { CounterContainer } from '../features/counter/CounterContainer'
import { DashboadContainer } from '../features/home/DashboadContainer'
import { SuspenseComtainer } from '../features/sandbox/suspence/SuspenseComtainer'
import { Nav, NavBar, NavItem } from '../components/bootstrap'
import { x } from '@xstyled/styled-components'
import { SandboxContainer } from '../features/sandbox/SandboxContainer'
import { PlaceContainer } from '../features/room/PlaceContainer'

export const App: React.FC = () => {
  return (
    <Router>
      <NavBar fixedTop dark>
        <Nav>
          <NavItem><Link to="/">Home</Link></NavItem>
          <NavItem><Link to="/counter">カウンタ</Link></NavItem>
          <NavItem><Link to="/sandbox">Sandbox</Link></NavItem>
          <NavItem><Link to="/room">Rooom</Link></NavItem>
        </Nav>
      </NavBar>
      <x.div mt="56px">
        <Switch>
          <Route path="/room" component={() => <PlaceContainer />} />
          <Route path="/counter" component={() => <CounterContainer />} />
          <Route path="/sandbox" component={() => <SandboxContainer />} />
          <Route path="/" component={() => <DashboadContainer />} />
        </Switch>
      </x.div>
    </Router>
  )
}