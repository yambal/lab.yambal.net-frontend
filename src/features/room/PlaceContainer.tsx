import React, { useCallback, useEffect, useState } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import Peer from 'skyway-js';
import { MeshRoomRoot } from './root/MeshRoomRoot'
import { PeerRoot } from './root/PeerRoot'
import { RoomSample } from './RoomSample';

let __peer: Peer | undefined
let __stream: MediaStream | undefined

type PlaceContainerProps = SystemProps & {

}

export const PlaceContainer: React.FC<PlaceContainerProps> = React.forwardRef(function Button(
  {
    ...restProps
  },
  ref
) {
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [stream, setStream] = useState<MediaStream | undefined>(undefined)

  const onPeer = useCallback((_peer: Peer) => {
    __peer = _peer
    setPeer(__peer)
  },[])

  const onMediaStream = useCallback((_stream: MediaStream) => {
    __stream = _stream
    setStream(__stream)
  },[])

  console.log(`xxx render PlaceContainer xxx`)

  return (
    <x.div
      ref={ref}
      {...restProps}
    >
      <PeerRoot
        aliKey="42f75ed0-a9ff-4f07-ad83-cecc2daa274c"
        onPeer={onPeer}
        onMediaStream={onMediaStream}
        peerUserNameLabel={`user: ${new Date()}`}
      >
        <MeshRoomRoot
          peer={peer}
          roomId="3rd"
          stream={stream}
        >
          <RoomSample />
        </MeshRoomRoot>
      </PeerRoot>
    </x.div>
  )
})
