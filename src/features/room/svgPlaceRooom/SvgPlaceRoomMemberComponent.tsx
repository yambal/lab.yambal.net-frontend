import React, { MouseEventHandler, useCallback, MouseEvent, useEffect, useMemo, } from 'react';

import { useRecoilValue } from "recoil"
import { distanceFamilyById, nameFamilyById, positionFamilyById } from "../peerAtom"

type SvgPlaceRoomMemberComponentProps = {
  peerId: string
  size: number
  color: string
}

export const SvgPlaceRoomMemberComponent = ({peerId, size, color}: SvgPlaceRoomMemberComponentProps) => {
  const name = useRecoilValue(nameFamilyById(peerId))
  const position = useRecoilValue(positionFamilyById(peerId))
  const distance = useRecoilValue(distanceFamilyById(peerId))

  const label = useMemo(() => {
    return name.slice( 0, 2 )
  },[name])
  return (
    position ? <g
      transform={`translate(${position?.x} ${position?.y})`}
    >
      <circle
        cx={0}
        cy={0}
        r={size}
        fill={color}
      />
      <text
        style={{userSelect: 'none', fontSize: '1.5rem'}}
        y={7}
        textAnchor="middle"
        fill="white"
      >{label}</text>
      <text 
        x={0}
        y={12}
        style={{userSelect: 'none'}}>{distance}</text>
    </g> : null
  )
}
