import React, { MouseEventHandler, useCallback, MouseEvent, useEffect, } from 'react';

import { useRecoilValue } from "recoil"
import { distanceFamilyById, nameFamilyById, positionFamilyById } from "./peerAtom"

type MemberComponentProps = {
  peerId: string
}

export const MemberComponent = ({peerId}: MemberComponentProps) => {
  const name = useRecoilValue(nameFamilyById(peerId))
  const position = useRecoilValue(positionFamilyById(peerId))
  const distance = useRecoilValue(distanceFamilyById(peerId))
  return (
    position ? <g
      transform={`translate(${position?.x} ${position?.y})`}
    >
      <circle
        cx={0}
        cy={0}
        r={20}
        fill="red"
      />
      <text style={{userSelect: 'none'}}>{name}</text>
      <text 
        x={0}
        y={12}
        style={{userSelect: 'none'}}>d:{distance}</text>
    </g> : null
  )
}
