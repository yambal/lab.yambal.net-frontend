import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { RecoilRoot, useRecoilState } from "recoil"
import Peer from 'skyway-js';
import { peerUserNameLabelState } from '../atoms';
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
      <MeshRoomInitializer peer={peer} roomId={roomId} peerUserNameLabel={peerUserNameLabel}/>
      {children}
    </RecoilRoot>
  )
}