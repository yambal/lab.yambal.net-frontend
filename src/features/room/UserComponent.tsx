import React, { MouseEvent, useCallback, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { nameFamilyById } from './peerAtom'

type UserComponentProps = {
  peerId:string
}

export const UserComponent = ({peerId}:UserComponentProps) => {
  const name = useRecoilValue(nameFamilyById(peerId))
  return (
    <li>{name}</li>
  )
}