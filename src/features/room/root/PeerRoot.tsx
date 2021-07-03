import React, { ReactNode } from 'react';
import { RecoilRoot } from "recoil"
import Peer from 'skyway-js';
import { MediaStreamInitializer } from './initializer/MediaStreamInitializer';
import { PeerInitializer } from './initializer/PeerInitializer';

type MeshRoomRootProps = {
  aliKey: string
  onPeer: (peer: Peer) => void
  onMediaStream: (stream: MediaStream) => void
  peerUserNameLabel: string
  children: ReactNode
}

export const PeerRoot = ({aliKey, onPeer, onMediaStream, peerUserNameLabel, children}: MeshRoomRootProps) => {
  return (
    <RecoilRoot>
      <PeerInitializer aliKey={aliKey} onPeer={onPeer} peerUserNameLabel={peerUserNameLabel}/>
      <MediaStreamInitializer onMediaStream={onMediaStream} />
      {children}
    </RecoilRoot>
  )
}