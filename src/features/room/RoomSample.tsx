import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

import { atomFamily, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { meshRoomIdState, meshRoomMemberIdsState, meshRoomMemberStateByPeerId, meshRoomMyPositionState } from "./atoms"

export const RoomSample = () => {
  const meshRoomId = useRecoilValue(meshRoomIdState)
  const peerIds = useRecoilValue(meshRoomMemberIdsState)
  const setMyPositon = useSetRecoilState(meshRoomMyPositionState)

  console.log(`11, ${meshRoomId}, ${peerIds}`)

  const onMoveHandler = useCallback(() => {
    setMyPositon({
      x: 10,
      y: 10,
      z: 10
    })
  },[setMyPositon])

  return (
    <>
      <h2>{meshRoomId}</h2>
      <ul>
        {peerIds.map((peerId) => {
          return <Member peerId={peerId} key={peerId}/>
        })}
      </ul>
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
    <div>
      <div>{peerId} : {member.name} ({member.position?.x}, {member.position?.y}, {member.position?.z})</div>
    </div>
  )
}