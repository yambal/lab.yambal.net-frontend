import { x } from '@xstyled/styled-components'
import React from 'react'
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom'
import { Container, Nav, NavBar, NavItem } from '../../components/bootstrap'
import { SuspenceContainer2 } from './suspence/SuspenceContainer2'
import { UseTransitionContainer } from './suspence/UseTransitionContainer'

export const SandboxContainer = () => {
  let match = useRouteMatch()
  return (
    <div>
      <NavBar primary>
        <Nav>
          <NavItem><Link to="/sandbox/suspense">Suspense</Link></NavItem>
          <NavItem><Link to="/sandbox/usetransition">useTransition</Link></NavItem>
        </Nav>
      </NavBar>
      <Switch>
        <Route path={`${match.path}/suspense`} component={() => <SuspenceContainer2 />} />
        <Route path={`${match.path}/usetransition`} component={() => <UseTransitionContainer />} />
        <Route path={`${match.path}/`}>
          <Container>
            <x.h2>Sandbox</x.h2>
          </Container>
        </Route>
      </Switch>
    </div>
  )
}

