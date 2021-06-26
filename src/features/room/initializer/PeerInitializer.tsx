import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useMount, useUnmount } from 'react-use'
import Peer from 'skyway-js'
import { SystemProps, x } from '@xstyled/styled-components'
import { PeerMethodsState, PeerIsOpenState, PeerIdState } from '../store/skywayAtoms'
import { useRecoilState } from 'recoil'
import { peerWrapper as _peerWrapper } from '../lib/peerWrapper'

const peerWrapper = _peerWrapper()

type PeerInitializerProps = SystemProps & {
  apiKey: string
}

export const PeerInitializer: React.FC<PeerInitializerProps> = React.forwardRef(function Button(
  {
    apiKey,
    ...restProps
  },
  ref
) {
  const [peerMethods, setPeerMothods] = useRecoilState(PeerMethodsState)
  const [peerIsOpen, setPeerIsOpen] = useRecoilState(PeerIsOpenState)
  const [peerId, setPeerId] = useRecoilState(PeerIdState)

  useMount(() => {
    peerWrapper.newPeer({
      key: apiKey,
      onPeerOpenListener: onPeerOpen,
      onPeerCloseListener: onPeerClose
    }).then( (method) => {
      setPeerMothods(method)
    })
  })

  const onPeerOpen = useCallback((peerId: string) => {
    console.log(`-- onPeerOpen ${peerId} --`)
    setPeerId(peerId)
    setPeerIsOpen(true)
  },[])

  const onPeerClose = useCallback(() => {
    console.log(`-- onPeerClose --`)
    setPeerId(undefined)
    setPeerIsOpen(false)
    setPeerMothods(undefined)
  },[])

  useUnmount(() => {
    peerMethods.destroy()
  })

  return (
    <React.Fragment />
  );
})