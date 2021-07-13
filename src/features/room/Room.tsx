import {isLoginState, firebaseMethodState, firebaseUserState} from '../../components/reactFirebase/firebaseAtom'
import { useRecoilValue } from 'recoil'
import React, { useCallback } from 'react'
import { PlaceContainer } from './logined/PlaceContainer'


export const RoomContainer = () => {
  const firebaseMethod = useRecoilValue(firebaseMethodState)
  const isLogin = useRecoilValue(isLoginState)
  const user = useRecoilValue(firebaseUserState)

  const onLogion = useCallback(() => {
    firebaseMethod.googleLogin()
  },[firebaseMethod])

  console.log(user?.photoURL)

  return (
    isLogin ? <PlaceContainer
      userName={user.displayName}
      avatarUrl={user.photoURL}
    />
    : <button type="button" onClick={onLogion}>Login</button>
  )
}