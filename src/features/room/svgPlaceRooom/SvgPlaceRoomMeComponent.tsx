import React, { useCallback, MouseEvent, useState, useTransition, useEffect } from 'react';
import { useRecoilState } from "recoil"
import { meshRoomMyPositionState } from "../peerAtom"
import { x } from '@xstyled/styled-components'
import { ExMemberPosition } from '../root/wrapper/exMeshRoomTypes';

type SvgPlaceRoomMeComponentProps = {
  name:string
  size: number
  onMove: (position: ExMemberPosition) => void
}

export const SvgPlaceRoomMeComponent = ({
  name,
  size,
  onMove
}: SvgPlaceRoomMeComponentProps) => {
  const [SvgOffset, setSvgOffset] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [clickOffset, setClickOffset] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [isDragging, setIsDragging] = useState(false)
  const [myPosition, setMyPositon] = useRecoilState(meshRoomMyPositionState)

  // DragStart
  const dragStartHandler = useCallback((event: MouseEvent<SVGCircleElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if(!isDragging) {
      // SVG の左肩座標を取得
      const domRect = event.currentTarget.getBoundingClientRect()
      setSvgOffset( {x: size + domRect.x - myPosition.x, y: size + domRect.y - myPosition.y})
      // 要素（円）内でのクリック座標
      setClickOffset( {
        x: event.clientX - domRect.x - size,
        y: event.clientY - domRect.y - size,
      })
      setIsDragging(true)
    }
  },[isDragging, myPosition])

  // Dragging
  const draggingHandler = useCallback((event: MouseEvent<SVGCircleElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if(isDragging){
      const gMousePos = {x: event.clientX - SvgOffset.x, y: event.clientY - SvgOffset.y}

      const newPos = {
        x: gMousePos.x - clickOffset.x,
        y: gMousePos.y - clickOffset.y,
      }
      
      setMyPositon({
        x: newPos.x,
        y: newPos.y,
        z: 0
      })
    }
  },[isDragging, myPosition])

  // DragEnd
  const dragEndHandler = useCallback((event: React.MouseEvent<SVGCircleElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if(isDragging) {
      setIsDragging(false)
      const gMousePos = {x: event.clientX - SvgOffset.x, y: event.clientY - SvgOffset.y}
      const newPos:ExMemberPosition = {
        x: gMousePos.x - clickOffset.x,
        y: gMousePos.y - clickOffset.y,
        z: 0
      }
      console.log('dragEndHandler')
      setMyPositon(newPos)
      onMove(newPos)
    }
  },[isDragging, myPosition])

  const clickHandler = useCallback((event: React.MouseEvent<SVGCircleElement>) => {
    event.preventDefault()
    event.stopPropagation()
  },[])

  return (
    myPosition ? <g
      transform={`translate(${myPosition.x} ${myPosition.y})`}
    >
      <x.circle
        onMouseDown={dragStartHandler}
        onMouseMove={draggingHandler}
        onMouseUp={dragEndHandler}
        onMouseOut={dragEndHandler}
        onClick={clickHandler}
        r={size}
        fill="red"
        cursor={isDragging ? 'grabbing' : 'grab'}
      />
    </g> : null
  )
}
