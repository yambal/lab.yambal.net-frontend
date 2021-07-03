import React from 'react';

import { useRecoilValue } from "recoil"
import { meshRoomIdState, meshRoomMemberIdsState } from "./peerAtom"
import { MemberComponent } from './MemberComponent'
import { MyComponent } from './MyComponent'

export const RoomSample = () => {
  const meshRoomId = useRecoilValue(meshRoomIdState)
  const peerIds = useRecoilValue(meshRoomMemberIdsState)

  console.log(`11, ${meshRoomId}, ${peerIds}`)

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
          return <MemberComponent peerId={peerId} key={peerId}/>
        })}
        <MyComponent name={'me'} size={15}/>
      </svg>
    </>
  )
}

