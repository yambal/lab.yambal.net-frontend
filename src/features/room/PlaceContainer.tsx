import React, { useCallback, useEffect, useState } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import { SkyeayRoot } from './SkywayRoot'
import { MeshRoomContainer } from './MeshRoomContainer'
import Peer from 'skyway-js';

type PlaceContainerProps = SystemProps & {

}

export const PlaceContainer: React.FC<PlaceContainerProps> = React.forwardRef(function Button(
  {
    ...restProps
  },
  ref
) {
  const [peer, setPeer] = useState<Peer | undefined>(undefined)

  return (
    <SkyeayRoot onPeer={setPeer}>
      <MeshRoomContainer peer={peer} roomId="3rd" />
    </SkyeayRoot>
  )
})