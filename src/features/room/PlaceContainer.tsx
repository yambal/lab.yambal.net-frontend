import React, { useCallback, useEffect, useState } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import { PeerContainer } from './PeerContainer'
import { MeshRoomContainer } from './MeshRoomContainer'
import Peer from 'skyway-js';

let __peer: Peer | undefined

type PlaceContainerProps = SystemProps & {

}

export const PlaceContainer: React.FC<PlaceContainerProps> = React.forwardRef(function Button(
  {
    ...restProps
  },
  ref
) {
  const [peer, setPeer] = useState<Peer | undefined>(undefined)

  const onPeer = useCallback((_peer: Peer) => {
    __peer = _peer
    setPeer(__peer)
  },[])

  return (
    <x.div
      ref={ref}
      {...restProps}
    >
      <PeerContainer
        onPeer={onPeer}
        bg="#CCCCCC"
      />
      <MeshRoomContainer
        peer={peer}
        roomId="2nd"
      />
    </x.div>
  )
})
