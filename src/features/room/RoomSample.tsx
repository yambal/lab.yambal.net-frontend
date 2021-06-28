import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

import { atomFamily, useRecoilState, useRecoilValue } from "recoil"
import { meshRoomIdState, meshRoomMemberIdsState, meshRoomMemberStateByPeerId } from "./atoms"

export const RoomSample = () => {
  const meshRoomId = useRecoilValue(meshRoomIdState)
  const peerIds = useRecoilValue(meshRoomMemberIdsState)

  console.log(`${meshRoomId}, ${peerIds}`)
  return (
    <>
      <h2>{meshRoomId}</h2>
      <ul>
        {peerIds.map((peerId) => {
          return <Member peerId={peerId} key={peerId}/>
        })}
      </ul>
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
      <div>{peerId} : {member.name}</div>
    </div>
  )
}