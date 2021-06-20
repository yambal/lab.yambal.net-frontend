import { SystemProps, x } from '@xstyled/styled-components'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUnmount } from 'react-use';
import { useRecoilState } from 'recoil';
import Peer, { MeshRoom } from 'skyway-js'
import { roomMembersState, RoomMemberState } from './atoms'

type RoomData = {
  dataType: 'ping' | 'res_ping'
  to: string | 'all'
  name: string
}

let __room: MeshRoom | undefined = undefined;
let __roomMembers: RoomMemberState = {}

type MeshRoomContainerProps = SystemProps & {
  peer: Peer | undefined
  roomId: string
}

export const MeshRoomContainer: React.FC<MeshRoomContainerProps> = React.forwardRef(function Button(
  {
    peer,
    roomId,
    ...restProps
  },
  ref
) {
  const [room, setRoom] = useState<MeshRoom>()
  const [roomMembers, setRoomNumbers] = useRecoilState(roomMembersState)

  useEffect(() => {
    if(peer){
      const _room:MeshRoom = peer.joinRoom(roomId, {
        mode: 'mesh'
      })
      _room.on('open', () => {
        __room = _room
        setRoom(__room)
      })
    }
  },[peer])

  useEffect(() => {
    if(room){
      console.log(`--- opened ---`)
      console.log(room)

      const data:RoomData = {
        dataType: "ping",
        to: 'all',
        name: ''
      }
      console.log(`send: ${JSON.stringify(data)}`)
      room.send(data)
  
      room.on('data', ({ src, data }) => {
        const from: string = src
        const recieveData: RoomData = data
        console.log(`data: ${JSON.stringify(recieveData)} from ${from}`)
        switch(`${recieveData.dataType}-${recieveData.to}`){
          case 'ping-all':
            const data:RoomData = {
              dataType: 'res_ping',
              to: from,
              name: ''
            }
            console.log(`send: ${JSON.stringify(data)}`)
            room.send(data)
            onPeerJoin(from, recieveData)
            break
          case `res_ping-${peer.id}`:
            console.log(`res ping ${JSON.stringify(recieveData)} from ${from}`)
            const member = {}
            member[from] = {
              name: recieveData.name
            }
            __roomMembers = Object.assign({}, __roomMembers, member)
            setRoomNumbers(__roomMembers)
            break
        }
      })
  
      room.on('peerJoin', peerId => {
        console.log(`--- ${peerId} joined ---`)
        
      })
      room.on('stream', stream => {
        console.log(`--- ${stream.peerId} stream ---`);
      })
      room.on('peerLeave', peerId => {
        console.log(`--- ${peerId} leaved ---`);
        onPeerLeave(peerId)
      })

      room.once('close', onRoomClose)

    } 
  },[room])

  // 退出通知が来た時
  const onPeerLeave = useCallback((peerId: string) => {
    console.log(`peer leave: ${JSON.stringify(__roomMembers)} - ${peerId}`)
    const newMember = Object.assign({}, __roomMembers)
    delete newMember[peerId]
    __roomMembers = newMember
    console.log(`= ${JSON.stringify(__roomMembers)}`)
    setRoomNumbers(__roomMembers)
  },[roomMembers])

  // 入出通知が来た時
  const onPeerJoin = useCallback((peerId: string, roomData: RoomData) => {
    console.log(`peer join: ${JSON.stringify(__roomMembers)} + ${peerId}`)
    const addMember = {}
    addMember[peerId] = {
      name: roomData.name
    }
    __roomMembers = Object.assign({}, __roomMembers, addMember)
    console.log(`= ${JSON.stringify(__roomMembers)}`)
    setRoomNumbers(__roomMembers)
  },[roomMembers])

  // ルームが閉じられたとき
  const onRoomClose = useCallback(() => {
    if(room){
      console.log(`-- on room close --`)
      __room = undefined
      __roomMembers = {}
      setRoomNumbers(__roomMembers)
    }
  },[room])

  // unMount
  useUnmount(() => {
    if(room){
      console.log(`-- room close --`)
      room.close()
    }
  })

  return (
    <x.div
      ref={ref}
      {...restProps}
    >
      <ul>
        {Object.keys(roomMembers).map((peerId) => {
          const roomMember = roomMembers[peerId]
          return <li key={peerId}>{peerId} : {roomMember.name}</li>
        })}
      </ul>
    </x.div>
  );
})
