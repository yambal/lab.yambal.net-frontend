import React, { ReactNode } from 'react';
import { RecoilRoot, useRecoilValue } from "recoil"
import Peer from 'skyway-js';
import { peerUserNameLabelState } from '../peerAtom';
import { MeshRoomInitializer } from './initializer/MeshRoomInitializer';

type MeshRoomRootProps = {
  peer: Peer
  roomId: string
  children: ReactNode
}

export const MeshRoomRoot = ({peer, roomId, children}: MeshRoomRootProps) => {
  const peerUserNameLabel = useRecoilValue(peerUserNameLabelState)
  
  return (
    <RecoilRoot>
      <MeshRoomInitializer
        peer={peer}
        roomId={roomId}
        myName={peerUserNameLabel}
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