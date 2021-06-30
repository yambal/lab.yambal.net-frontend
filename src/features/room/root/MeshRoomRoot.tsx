import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { RecoilRoot, useRecoilState } from "recoil"
import Peer from 'skyway-js';
import { meshRoomMyPositionState, peerUserNameLabelState } from '../atoms';
import { MeshRoomInitializer } from './initializer/MeshRoomInitializer';

type MeshRoomRootProps = {
  peer: Peer
  roomId: string
  children: ReactNode
}

export const MeshRoomRoot = ({peer, roomId, children}: MeshRoomRootProps) => {
  const [peerUserNameLabel, setPeerUserNameLabel] = useRecoilState(peerUserNameLabelState)
  

  return (
    <RecoilRoot>
      <MeshRoomInitializer
        peer={peer}
        roomId={roomId}
        peerUserNameLabel={peerUserNameLabel}
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