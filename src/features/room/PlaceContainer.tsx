import React, { useCallback, useEffect, useState } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import Peer from 'skyway-js';
import { MeshRoomRoot } from './root/MeshRoomRoot'
import { PeerRoot } from './root/PeerRoot'
import { SvgPlaceRooomComponent } from './svgPlaceRooom/SvgPlaceRooomComponent'
import Measure from 'react-measure'
import {UsersComponant} from './UsersComponant'

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
  const [bouns, setBouns] = useState<{w: number, h:number} | undefined>({ w: 640, h: 640 })

  const onPeer = useCallback((_peer: Peer) => {
    __peer = _peer
    setPeer(__peer)
  },[])

  const onMediaStream = useCallback((_stream: MediaStream) => {
    __stream = _stream
    setStream(__stream)
  },[])

  const onBounse = useCallback((contentRect: any) => {
    setBouns({w: contentRect.bounds.width, h: contentRect.bounds.height})
  },[])

  console.log(`xxx render PlaceContainer xxx`)

  return (
    <Measure
      bounds
      onResize={onBounse}
    >
      {({ measureRef }) => (
        <x.div
          ref={measureRef}
          w="100%"
          h={'calc(100vh - 56px)'}
          display="flex"
        >
          <PeerRoot
            aliKey="42f75ed0-a9ff-4f07-ad83-cecc2daa274c"
            onPeer={onPeer}
            onMediaStream={onMediaStream}
            peerUserNameLabel={`user: ${new Date()}`}
          >
            {stream && <MeshRoomRoot
              peer={peer}
              roomId="3rd"
              stream={stream}
            >
              <SvgPlaceRooomComponent
                width={bouns.w - 250}
                height={bouns.h}
              />
            </MeshRoomRoot>}

            <MeshRoomRoot
              peer={peer}
              roomId="users"
            >
              <UsersComponant />
            </MeshRoomRoot>
          </PeerRoot>
        </x.div>
      )}
    </Measure>
  )
})
