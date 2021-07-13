import React, { MouseEventHandler, useCallback, MouseEvent, useEffect, useMemo, } from 'react';

import { useRecoilValue } from "recoil"
import { distanceFamilyById, nameFamilyById, avatarUrlFamilyById, positionFamilyById } from "../logined/peerAtom"

type SvgPlaceRoomMemberComponentProps = {
  peerId: string
  size: number
  color: string
}

export const SvgPlaceRoomMemberComponent = ({peerId, size, color}: SvgPlaceRoomMemberComponentProps) => {
  const name = useRecoilValue(nameFamilyById(peerId))
  const avaterUrl = useRecoilValue(avatarUrlFamilyById(peerId))
  const position = useRecoilValue(positionFamilyById(peerId))
  const distance = useRecoilValue(distanceFamilyById(peerId))

  const label = useMemo(() => {
    return name.slice( 0, 2 )
  },[name])
  return (
    position ? <g
      transform={`translate(${position?.x} ${position?.y})`}
    >
      <clipPath id={`clip-${peerId}`}>
        <circle
          cx={0}
          cy={0}
          r={size}
          fill="red"
        />
      </clipPath>
      <image
        href={`${avaterUrl}`}
        clipPath={`url(#clip-${peerId})`}
        height={size * 2}
        width={size * 2}
        x={-size}
        y={-size}
        preserveAspectRatio="xMidYMid slice"
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
