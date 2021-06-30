import React, { useState, useEffect, useCallback, useMemo, ReactNode, useTransition } from 'react';

import { atomFamily, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { meshRoomIdState, meshRoomMemberIdsState, meshRoomMemberStateByPeerId, meshRoomMyPositionState } from "./atoms"

export const RoomSample = () => {
  const meshRoomId = useRecoilValue(meshRoomIdState)
  const peerIds = useRecoilValue(meshRoomMemberIdsState)
  const [myPosition, setMyPositon] = useRecoilState(meshRoomMyPositionState)

  const [isPending, startTransition] = useTransition({
    timeoutMs: 3000
  });

  console.log(`11, ${meshRoomId}, ${peerIds}`)

  const onMoveHandler = useCallback(() => {
    startTransition(() => {
      // State更新を遅らせて良いよ
      setMyPositon({
        x: myPosition.x + 10,
        y: myPosition.y + 10,
        z: myPosition.z + 10,
      })
    })

  },[myPosition, setMyPositon])

  return (
    <>
      <h2>{meshRoomId}</h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={300}
        height={300}
        viewBox="0 0 300 300"
      >
        {peerIds.map((peerId) => {
          return <Member peerId={peerId} key={peerId}/>
        })}
        <g transform={`translate(${myPosition?.x} ${myPosition?.y})`}>
          <circle r={20} fill="blue"/>
        </g>
      </svg>
      <button type="button" onClick={onMoveHandler}>move</button>
    </>
  )
}

type MemberProps = {
  peerId: string
}

const Member = ({peerId}: MemberProps) => {
  const member = useRecoilValue(meshRoomMemberStateByPeerId(peerId))
  console.log(`${peerId}, ${JSON.stringify(member)}`)
  return (
    <g transform={`translate(${member.position?.x} ${member.position?.y})`}>
      <circle
        cx={0}
        cy={0}
        r={20}
        fill="red"
      />
      <text>{member.name}</text>
    </g>
  )
}
