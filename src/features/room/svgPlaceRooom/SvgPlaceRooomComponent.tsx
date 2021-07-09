import React, { MouseEvent, useCallback, useMemo, useState } from 'react'

import { useRecoilValue, useSetRecoilState } from "recoil"
import { meshRoomMemberIdsState, meshRoomMyPositionState } from "../peerAtom"
import { SvgPlaceRoomMemberComponent } from './SvgPlaceRoomMemberComponent'
import { SvgPlaceRoomMeComponent } from './SvgPlaceRoomMeComponent'
import { MemberAudio } from '../MemberAudio'
import { ExMemberPosition } from '../root/wrapper/exMeshRoomTypes'
import { motion } from "framer-motion"

type SvgPlaceRooomComponentProps = {
  width: number
  height: number
}

export const SvgPlaceRooomComponent = ({width, height}: SvgPlaceRooomComponentProps) => {
  const peerIds = useRecoilValue(meshRoomMemberIdsState)
  const [myPos, setMyPos] = useState<ExMemberPosition>({x: 0, y: 0, z: 0})
  const setMyPositon = useSetRecoilState(meshRoomMyPositionState)

  const onMove = useCallback((myPosition) => {
    setMyPos(myPosition)
  },[myPos])

  const viewBoxBound = useMemo(() => {
    const vb = {
      x: myPos.x - (width / 2),
      y: myPos.y - (height / 2),
      width,
      height 
    }
    return vb
  },[myPos, width, height])

  const viewBox = useMemo(() => {
    return `${viewBoxBound.x} ${viewBoxBound.y} ${width} ${height}`
  },[viewBoxBound])

  const onSvgClick = useCallback((event: MouseEvent<SVGElement>) => {
    const domRect = event.currentTarget.getBoundingClientRect()
    const clickSVGPoint = {x: event.clientX - domRect.x, y: event.clientY - domRect.y}
    const clickSVGCirclePoint = {x: clickSVGPoint.x + viewBoxBound.x, y: clickSVGPoint.y + viewBoxBound.y, z: 0}
    setMyPositon(clickSVGCirclePoint)
    onMove(clickSVGCirclePoint)
  },[myPos, width, height, viewBoxBound])

  return (
    <>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        animate={{ viewBox }}
        viewBox={`0 0 ${width} ${height}`}
        transition={{type: "spring", damping: 17}}
        onClick={onSvgClick}
        style={{flexShrink: 0}}
      >
        <rect x={-250} y={-250} width={250} height={250} fill="lightGray"/>
        {peerIds.map((peerId) => {
          return <SvgPlaceRoomMemberComponent peerId={peerId} key={peerId} size={15} color="Gray"/>
        })}
        <SvgPlaceRoomMeComponent name={'me'} size={20} onMove={onMove}/>
      </motion.svg>
      {peerIds.map((peerId) => {
        return (
          <MemberAudio peerId={peerId} key={peerId}/>
        )
      })}
    </>
  )
}

