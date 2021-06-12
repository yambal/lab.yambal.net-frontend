import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../components/bootstrap'


export const DashboadContainer = () => {
  return (
    <Container pt="1rem">
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
  )
}