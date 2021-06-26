import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useMount, useUnmount } from 'react-use'
import Peer from 'skyway-js'
import { SystemProps, x } from '@xstyled/styled-components'
import { PeerMethodsState, PeerIsOpenState, PeerIdState } from './store/skywayAtoms'
import { useRecoilState } from 'recoil'
import { peerWrapper as _peerWrapper } from './lib/peerWrapper'

export const PeerContainer = () => {
  const [peerId, setPeerId] = useRecoilState(PeerIdState)
  return (
    <div>{peerId}</div>
  )
}