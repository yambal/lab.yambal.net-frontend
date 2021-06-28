import React, { ReactNode } from 'react';
import { RecoilRoot } from "recoil"
import Peer from 'skyway-js';
import { PeerInitializer } from './initializer/PeerInitializer';

type MeshRoomRootProps = {
  aliKey: string
  onPeer: (peer: Peer) => void
  peerUserNameLabel: string
  children: ReactNode
}

export const PeerRoot = ({aliKey, onPeer, peerUserNameLabel, children}: MeshRoomRootProps) => {
  return (
    <RecoilRoot>
      <PeerInitializer aliKey={aliKey} onPeer={onPeer} peerUserNameLabel={peerUserNameLabel}/>
      {children}
    </RecoilRoot>
  )
}