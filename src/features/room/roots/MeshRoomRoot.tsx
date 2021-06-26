import { SystemProps, x } from '@xstyled/styled-components'
import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useUnmount } from 'react-use';
import { useRecoilState } from 'recoil';
import Peer, { MeshRoom } from 'skyway-js'
import { PeerIsOpenState, PeerMethodsState, PeerIdState } from '../store/skywayAtoms'
import { meshRoomWraper } from '../lib/meshRoomWraper';
import { RecoilRoot } from 'recoil'
import { MeshRoomInitializer } from '../initializer/RoomInitializer'

type RoomData = {
  dataType: 'ping' | 'res_ping'
  to: string | 'all'
  name: string
}

type MeshRoomRootProps = SystemProps & {
  roomId: string
}

export const MeshRoomRoot: React.FC<MeshRoomRootProps> = React.forwardRef(function Button(
  {
    roomId,
    children,
    ...restProps
  },
  ref
) {
  const [peerMethods, setPeerMothods] = useRecoilState(PeerMethodsState)
  const [peerIsOpen, setPeerIsOpen] = useRecoilState(PeerIsOpenState)
  const [peerId, setPeerId] = useRecoilState(PeerIdState)

  return (
    <RecoilRoot>
      <MeshRoomInitializer roomId={roomId} peerMethods={peerMethods} peerIsOpen={peerIsOpen} peerId={peerId}>
        {children}
      </MeshRoomInitializer>
    </RecoilRoot>
  );
})

