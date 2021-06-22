import React, { useCallback, ReactNode, useState, Children } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import { PeerContainer } from './PeerContainer'
import { MeshRoomContainer } from './MeshRoomContainer'
import Peer from 'skyway-js'
import { RecoilRoot } from 'recoil'

let __peer: Peer | undefined

type SkyeayRootProps = SystemProps & {
  children: ReactNode
  onPeer: (peer: Peer) => void
}

export const SkyeayRoot: React.FC<SkyeayRootProps> = React.forwardRef(function Button(
  {
    children,
    onPeer,
    ...restProps
  },
  ref
) {
  return (
    <RecoilRoot>
      <x.div
        ref={ref}
        {...restProps}
      >
        <PeerContainer
          onPeer={onPeer}
          bg="#CCCCCC"
        />
        {children}
      </x.div>
    </RecoilRoot>
  )
})
