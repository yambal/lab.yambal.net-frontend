import React, { MouseEventHandler, useCallback, MouseEvent, } from 'react';

import { useRecoilValue } from "recoil"
import { meshRoomMemberStateByPeerId } from "./peerAtom"

type MemberComponentProps = {
  peerId: string
}


export const MemberComponent = ({peerId}: MemberComponentProps) => {
  const member = useRecoilValue(meshRoomMemberStateByPeerId(peerId))

  return (
    member.position ? <g
      transform={`translate(${member.position?.x} ${member.position?.y})`}
    >
      <circle
        cx={0}
        cy={0}
        r={20}
        fill="red"
      />
      <text style={{userSelect: 'none'}}>{member.name}</text>
    </g> : null
  )
}
