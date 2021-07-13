import React, { ReactNode } from 'react';
import { RecoilRoot, useRecoilValue } from "recoil"
import Peer from 'skyway-js';
import { peerMyNameState, peerAvatarUrlState } from '../logined/peerAtom';
import { MeshRoomInitializer } from './initializer/MeshRoomInitializer';

type MeshRoomRootProps = {
  peer: Peer
  stream?: MediaStream
  roomId: string
  children: ReactNode
}

export const MeshRoomRoot = ({peer, stream, roomId, children}: MeshRoomRootProps) => {
  const peerUserName = useRecoilValue(peerMyNameState)
  const peerAvatarUrl= useRecoilValue(peerAvatarUrlState)
  
  return (
    <RecoilRoot>
      <MeshRoomInitializer
        peer={peer}
        stream={stream}
        roomId={roomId}
        myName={peerUserName}
        avatarUrl={peerAvatarUrl}
        startPosition={{
          x: 15,
          y: 15,
          z: 0
        }}
      />
      {children}
    </RecoilRoot>
  )
}