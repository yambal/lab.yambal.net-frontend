import React, { useState, useCallback, Fragment } from 'react';
import { useMount, useUnmount } from 'react-use';
import Peer from 'skyway-js'
import { SystemProps, x } from '@xstyled/styled-components'
import { peerWrapper } from '../wrapper/peerWrapper';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { peerMyNameState } from '../../peerAtom';

let __peer: Peer | undefined

type PeerInitializerProps = {
  aliKey: string
  onPeer: (peer: Peer) => void
  peerUserNameLabel: string
}

export const PeerInitializer = ({aliKey, onPeer, peerUserNameLabel}:PeerInitializerProps) => {

  const [peer, setPeer] = useState<Peer>()
  const setPeerMyName = useSetRecoilState(peerMyNameState)

  useMount(() => {
    peerWrapper(aliKey, {
      peerOnClose: onPeerClose
    }).then(({peer, peerId}) => {
      __peer = peer
      setPeer(__peer)
      onPeer(__peer)
    })
    setPeerMyName(peerUserNameLabel)
  })

  const onPeerClose = useCallback(() => {
    console.log(`-- on peer close --`)
    __peer = undefined
    setPeer(undefined)
  },[])

  useUnmount(() => {
    if(peer) {
      console.log(`-- peer destroy --`)
      peer.destroy()
    }
  })

  return (
    <Fragment />
  );
}