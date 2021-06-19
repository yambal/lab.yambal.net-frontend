import React, { useCallback, useEffect, useState } from 'react';
import { x } from '@xstyled/styled-components'

type PlaceConponentProps = {
  members: string[]
}

export const PlaceConponent = ({members}:PlaceConponentProps) => {
  const [isDragging, setIsDragging] = useState(false)
  console.log(`m ${members}`)

  const onMouseMove = useCallback((e: React.MouseEvent<SVGAElement>) => {
    if(isDragging){

    }
  },[])

  const onMouseDown = useCallback((e: React.MouseEvent<SVGAElement>) => {
    console.log(`md`)
    setIsDragging(true)
  },[])

  const onMouseUp = useCallback((e: React.MouseEvent<SVGAElement>) => {
    console.log(`mu`)
    setIsDragging(false)
  },[])

  return (
    <x.svg
      xmlns="http://www.w3.org/2000/svg"
      w={640}
      h={640}
      bg="#cccccc"
      viewBox="0 0 640 640"
      onMouseMove={onMouseMove}
    >
        {members && members.map((member) => {
          return <Member key={member}
            cx={20}
            cy={20}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          />
        })}
    </x.svg>
  )
}

type MemberProps = {
  cx:number
  cy:number
  onMouseDown: (e: React.MouseEvent<SVGAElement>) => void
  onMouseUp: (e: React.MouseEvent<SVGAElement>) => void
}

export const Member = ({cx, cy, onMouseDown, onMouseUp }:MemberProps) => {
  return (
    <g
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <x.circle
        cx={cx}
        cy={cy}
        r={20}
        fill="red"

      />
    </g>
  )
} 