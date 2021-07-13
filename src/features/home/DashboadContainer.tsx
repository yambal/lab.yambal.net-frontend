import React, {useCallback} from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../../components/bootstrap'

import {isLoginState, firebaseMethodState, firebaseUserState} from '../../components/reactFirebase/firebaseAtom'
import { useRecoilValue } from 'recoil'

export const DashboadContainer = () => {
  const firebaseMethod = useRecoilValue(firebaseMethodState)
  const isLogin = useRecoilValue(isLoginState)
  const user = useRecoilValue(firebaseUserState)

  const onLogion = useCallback(() => {
    firebaseMethod.googleLogin()
  },[firebaseMethod])

  const onSignOut = useCallback(() => {
    firebaseMethod.signOut()
  },[firebaseMethod])
  
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
      {isLogin ? <div>
        <button type="button" onClick={onSignOut}>onSignOut</button>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
  : <button type="button" onClick={onLogion}>Login</button>}
    </Container>
  )
}
