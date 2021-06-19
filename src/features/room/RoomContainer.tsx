import React, { useCallback, useEffect, useMemo, useState,  } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import { useMount, useUnmount } from 'react-use'
import Peer, {MeshRoom} from 'skyway-js'
import { useRecoilState } from 'recoil'
import {
  peerIsOpenState,
  peerMyPeerIdState,
  roomIsOpenState,
  RoomMember,
  roomMembersState,
  RoomMemberState
} from './atoms';

const DATA_TYPE = {
  PING: 'ping',
  RES_PING: 'res_ping'
}

type RoomContainerProp = typeof x.div.defaultProps & {
  peer: Peer
}

export const RoomContainer: React.FC<RoomContainerProp> = React.forwardRef<typeof x.div>(function PeerContainer(
  {
    children,
    peer,
    ...restProps
  }:RoomContainerProp,
  ref
) {
  const [peerIsOpen, setPeerIsOpen] = useRecoilState(peerIsOpenState)
  const [myPeerId, setMyPeerId] = useRecoilState(peerMyPeerIdState)
  const [roomIsOpen, setRoomIsOpen] = useRecoilState(roomIsOpenState)
  const [roomMembers, setRoomMembers] = useRecoilState(roomMembersState)

  useUnmount(() => { 
    if(room) {
      room.close()
    }
  })

  // Room
  const room = useMemo(() => {
    if(peerIsOpen && peer){
      const _room: MeshRoom = peer.joinRoom('4st')
      _room.on('open', (peerId) => {
        setRoomIsOpen(true)
      })
      return _room
    } 
    return undefined
  },[peerIsOpen, peer])

  const myMemberData: RoomMember = useMemo(() => {
    return {
      peerId: myPeerId,
      name: '',
      position: {
        x: 0,
        y: 0
      }
    }
  },[myPeerId])

  useEffect(() => {
    if(roomIsOpen) {
      room.on('data', onData)
      room.on('close',onRoomClose)
      room.on('peerLeave', onPeerLeave)
      room.send({
        dataType: DATA_TYPE.PING,
        member: myMemberData
      })
    }
  },[roomIsOpen])

  const onData = useCallback((catchData) => {
    const dataType = catchData.data.dataType
    const member: RoomMember = catchData.data.member
    
    switch(dataType){
      case DATA_TYPE.PING:
        fetchMember(member)
        room.send({
          dataType: DATA_TYPE.RES_PING,
          member: myMemberData
        })
        break
      case DATA_TYPE.RES_PING:
        fetchMember(member)
        break
    }
  },[room, roomMembers])

  const onRoomClose = useCallback(() => {
    console.log(`room close`)
    setRoomIsOpen(false)
    setRoomMembers({})
  },[])

  const onPeerLeave = useCallback((peerId: string) => {
    const newRoomMembers = Object.assign({}, roomMembers)
    delete newRoomMembers[peerId]
    setRoomMembers(newRoomMembers)
  },[roomMembers])

  const fetchMember = useCallback((member: RoomMember) => {
    const fetchMenber: RoomMemberState = {}
    fetchMenber[member.peerId] = member
    console.log(`roomMembers A ${JSON.stringify(roomMembers)}`)
    const newRoomMembers = Object.assign({}, roomMembers, fetchMenber)
    console.log(`roomMembers B ${JSON.stringify(newRoomMembers)}`)
    setRoomMembers(newRoomMembers)
  },[roomMembers])

  return(
    <x.div
      className="PeerContainer"
      ref={ref}
      {...restProps}
    >
      <ul>
        {Object.keys(roomMembers).map((m) => {
          return <li key={roomMembers[m].peerId}>{roomMembers[m].peerId} : {roomMembers[m].position.x}</li>
        })}
      </ul>
    </x.div>
  )
})