import { SystemProps, x } from '@xstyled/styled-components';
import React, { useCallback, useEffect, useMemo, useRef, useState,  } from 'react';
import { PeerContainer } from './PeerContainer'
import { RoomContainer } from './RoomContainer'
import Peer from 'skyway-js'

type PlaceContainerProps = SystemProps & {

}

export const PlaceContainer = () => {
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const onPeer = useCallback((peer: Peer) => {
    console.log('setPeer')
    setPeer(peer)
  },[])
  
  return (
    <x.div>
      <PeerContainer
        bg="#CCCCCC"
        onPeer={onPeer}
      />
      <RoomContainer
        peer={peer}
        bg="#BBBBBB"
      />
    </x.div>
  )
}