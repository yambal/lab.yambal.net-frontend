import React, { MouseEvent, useCallback, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { meshRoomMemberIdsState } from './peerAtom'
import { UserComponent } from './UserComponent'

export const UsersComponant = () => {
  const peerIds = useRecoilValue(meshRoomMemberIdsState)
  console.log(peerIds)
  return (
    <ul>
      {peerIds.map((peerId) => {
        return <UserComponent peerId={peerId}/>
      })}
    </ul>
  )
}