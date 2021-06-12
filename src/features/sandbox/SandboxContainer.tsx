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
import { SuspenseComtainer } from './suspence/SuspenseComtainer'

export const SandboxContainer = () => {
  let match = useRouteMatch()
  return (
    <div>
      <NavBar primary>
        <Nav>
          <NavItem><Link to="/sandbox/suspense">Suspense</Link></NavItem>
        </Nav>
      </NavBar>
      <Switch>
        <Route path={`${match.path}/suspense`} component={() => <SuspenseComtainer />} />
        <Route path={`${match.path}/`}>
          <Container>
            <x.h2>Sandbox</x.h2>
          </Container>
        </Route>
      </Switch>
    </div>
  )
}

