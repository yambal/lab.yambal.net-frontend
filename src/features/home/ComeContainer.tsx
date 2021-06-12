import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../components/bootstrap'
import { Nav, NavBar, NavItem } from '../../components/bootstrap/'

export const HomeContainer = () => {
  return (
    <div>
      <NavBar fixedTop primary>
        <Nav>
          <NavItem><Link to="/counter">カウンタ</Link></NavItem>
          <NavItem><Link to="/counter">カウンタ</Link></NavItem>
        </Nav>
      </NavBar>
      <Container>
        <h1>やぁ、世界</h1>
        <p>いろはにおへどちりぬるを</p>
        <h2>やぁ、世界</h2>
        <p>いろはにおへどちりぬるを</p>
        <h3>やぁ、世界</h3>
        <p>いろはにおへどちりぬるを</p>
        <h4>やぁ、世界</h4>
        <p>いろはにおへどちりぬるを</p>
        <h5>やぁ、世界</h5>
        <p>いろはにおへどちりぬるを</p>
        <h6>やぁ、世界</h6>
        <p>いろはにおへどちりぬるを</p>
        <hr />
        <Link to="/counter">カウンタ</Link>
      </Container>
    </div>
  )
}