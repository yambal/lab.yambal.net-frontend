import React, { useCallback, useEffect, useState } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import { PeerRoot } from './roots/PeerRoot'
import { MeshRoomRoot } from './roots/MeshRoomRoot'
import Peer from 'skyway-js'
import {PeerContainer} from './PeerContainer';

type PlaceContainerProps = SystemProps & {

}

export const PlaceContainer: React.FC<PlaceContainerProps> = React.forwardRef(function Button(
  {
    ...restProps
  },
  ref
) {
  return (
    <PeerRoot apiKey="42f75ed0-a9ff-4f07-ad83-cecc2daa274c">
      <PeerContainer />
      <MeshRoomRoot roomId="7th" />
    </PeerRoot>
  )
})