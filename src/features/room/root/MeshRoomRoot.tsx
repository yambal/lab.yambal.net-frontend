import React, { ReactNode } from 'react';
import { RecoilRoot, useRecoilValue } from "recoil"
import Peer from 'skyway-js';
import { peerMyNameState } from '../peerAtom';
import { MeshRoomInitializer } from './initializer/MeshRoomInitializer';

type MeshRoomRootProps = {
  peer: Peer
  stream: MediaStream
  roomId: string
  children: ReactNode
}

export const MeshRoomRoot = ({peer, stream, roomId, children}: MeshRoomRootProps) => {
  const peerUserName = useRecoilValue(peerMyNameState)
  
  return (
    <RecoilRoot>
      <MeshRoomInitializer
        peer={peer}
        stream={stream}
        roomId={roomId}
        myName={peerUserName}
        startPosition={{
          x: 0,
          y: 0,
          z: 0
        }}
      />
      {children}
    </RecoilRoot>
  )
}