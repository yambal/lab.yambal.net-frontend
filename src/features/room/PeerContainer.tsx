import React, { useCallback, useEffect, useMemo, useState,  } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import { useMount, useUnmount } from 'react-use'
import Peer, {MeshRoom} from 'skyway-js'
import { useRecoilState } from 'recoil'
import {
  peerIsOpenState,
  peerMyPeerIdState,
} from './atoms';
import { RoomContainer } from './RoomContainer';


type PeerContainerProp = typeof x.div.defaultProps & {
  onPeer: (peer: Peer) => void
}

export const PeerContainer: React.FC<PeerContainerProp> = React.forwardRef<typeof x.div>(function PeerContainer(
  {
    children,
    onPeer,
    ...restProps
  }:PeerContainerProp,
  ref
) {
  const [peerIsOpen, setPeerIsOpen] = useRecoilState(peerIsOpenState)
  const [myPeerId, setMyPeerId] = useRecoilState(peerMyPeerIdState)

  useUnmount(() => { 
    if(peer){
      peer.destroy()
    }
  })

  // Peer
  const peer = useMemo(() => {
    const _peer = new Peer({key: '42f75ed0-a9ff-4f07-ad83-cecc2daa274c'})
    _peer.on('open', (peerId) => {
      setPeerIsOpen(true)
      setMyPeerId(peerId)
    })
    return _peer
  },[])

  useEffect(() => {
    if(peerIsOpen) {
      peer.on('close', onPeerClose)
      onPeer(peer)
    }
  },[peerIsOpen])

  const onPeerClose = useCallback(() => {
    console.log(`peer close`)
    setPeerIsOpen(false)
    setMyPeerId(undefined)
  },[peerIsOpen])

  return(
    <x.div
      className="PeerContainer"
      ref={ref}
      {...restProps}
    >
      <div>{peerIsOpen && "open"}</div>
      {myPeerId && myPeerId}
    </x.div>
  )
})