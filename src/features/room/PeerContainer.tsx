import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMount, useUnmount } from 'react-use';
import Peer, { MeshRoom } from 'skyway-js'
import { MeshRoomContainer } from './MeshRoomContainer'
import { SystemProps, x } from '@xstyled/styled-components'

let __peer: Peer | undefined

type PeerContainerProps = SystemProps & {
  onPeer: (peer: Peer) => void
}

export const PeerContainer: React.FC<PeerContainerProps> = React.forwardRef(function Button(
  {
    onPeer,
    ...restProps
  },
  ref
) {
  const [peer, setPeer] = useState<Peer>()

  useMount(() => {
    const _peer = new Peer({key: '42f75ed0-a9ff-4f07-ad83-cecc2daa274c', debug: 0});
    _peer.on('open', ()=> {
      onPeerOpen(_peer)
    });
  })

  const onPeerOpen = useCallback((_peer: Peer) => {
    __peer = _peer
    setPeer(__peer)
  },[])

  const onPeerClose = useCallback(() => {
    console.log(`-- on peer close --`)
    __peer = undefined
    setPeer(undefined)
  },[])

  useEffect(() => {
    if(peer){
      onPeer(peer)
      peer.on('close', onPeerClose)
    }
  },[peer])

  useUnmount(() => {
    if(peer) {
      console.log(`-- peer destroy --`)
      peer.destroy()
    }
  })



  return (
    <x.div
      ref={ref}
      {...restProps}
    >
      <div>{peer && peer.id}</div>
    </x.div>
  );
})