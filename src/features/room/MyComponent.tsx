import React, { useCallback, MouseEvent, useState, useTransition } from 'react';

import { useRecoilState } from "recoil"
import { meshRoomMyPositionState } from "./peerAtom"

type MyComponentProps = {
  name:string
  size: number
}

export const MyComponent = ({name, size}: MyComponentProps) => {
  const [SvgOffset, setSvgOffset] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [clickOffset, setClickOffset] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [isDragging, setIsDragging] = useState(false)
  const [myPosition, setMyPositon] = useRecoilState(meshRoomMyPositionState)

  // DragStart
  const dragStartHandler = useCallback((event: MouseEvent<SVGCircleElement>) => {
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
  },[isDragging])

  // DragEnd
  const dragEndHandler = useCallback((event: React.MouseEvent<SVGCircleElement>) => {
    if(isDragging) {
      setIsDragging(false)
      const gMousePos = {x: event.clientX - SvgOffset.x, y: event.clientY - SvgOffset.y}
      setMyPositon({
        x: gMousePos.x - clickOffset.x,
        y: gMousePos.y - clickOffset.y,
        z: 0
      })
    }
  },[isDragging])

  return (
    myPosition ? <g
      transform={`translate(${myPosition.x} ${myPosition.y})`}
    >
      <circle
        onMouseDown={dragStartHandler}
        onMouseMove={draggingHandler}
        onMouseUp={dragEndHandler}
        onMouseOut={dragEndHandler}
        r={20}
        fill="red"
      />
    </g> : null
  )
}
