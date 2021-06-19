import React, { useCallback, useEffect, useState } from 'react';
import { x } from '@xstyled/styled-components'
import { useMount, useUnmount } from 'react-use'
import Peer, {MeshRoom} from 'skyway-js'
import { PlaceConponent } from './Place'

type Log = {
  timestamp: string
  messageType: string
  message: {
    roomName: string
    roomType: string
    src: string
  }
}

export const RoomContainer = () => {
  const [peer, setPeer] = useState<Peer | undefined>(undefined)
  const [room, setRoom] = useState<MeshRoom | undefined>(undefined)
  const [isOpen, setisOpen] = useState<boolean>(false)
  const [rooomIsOpen, setRoomIsOpen] = useState<boolean>(false)
  const [logs, setLogs] = useState<Log[] | undefined>(undefined)
  const [roomIventInited, setRoomIventInited] = useState<boolean>(false)
  const [roomMemberPeerIds, setRoomMemberPeerIds] = useState<string[] | undefined>(undefined)
  
  useMount(() => {
    setPeer(new Peer({key: '42f75ed0-a9ff-4f07-ad83-cecc2daa274c'}))
  })

  useUnmount(() => {
    if(room) {
      room.close()
    }
  })

  useEffect(() => {
    if(peer) {
      peer.on('open', (peerId: string) => {
        setisOpen(true)
      })
    }
  },[peer])

  useEffect(() => {
    if (peer && isOpen) {
      const _room:MeshRoom = peer.joinRoom('3nd')
      setRoom(_room)
    }
  },[peer, isOpen])

  useEffect(() => {
    if(room) {
      room.on('open', (peerId: string) => {
        setRoomIsOpen(true)
      })
    }
  },[room])

  // Log を請求する
  useEffect(() => {
    if(room && rooomIsOpen) {
      room.on('log', onLog)
      room.getLog()
    }
  },[room, rooomIsOpen])

  // Log からメンバーを割り出す
  const onLog = useCallback((jsonLogs: string[]) => {
    const _logs: Log[] = jsonLogs.map((jsonLog) => {
      return JSON.parse(jsonLog)
    })

    const ids: string[] = []
    _logs.forEach((_log) => {
      if(_log.messageType === 'ROOM_USER_JOIN'){
        ids.push(_log.message.src)
      }else if(_log.messageType === 'ROOM_USER_LEAVE'){
        ids.splice(ids.indexOf(_log.message.src), 1)
      }
    })
    setRoomMemberPeerIds(ids)
    setLogs(_logs)
  }, [room])

  // RoomにEventListener
  useEffect(() => {
    if(!roomIventInited && room && logs) {
      setRoomIventInited(true)
      room.on('peerJoin', onPeerJoin)
      room.on('peerLeave', onPeerLeave)
    }
  },[room, roomIventInited, logs, roomMemberPeerIds])

  // Join
  const onPeerJoin = useCallback((peerId: string) => {
    console.log(`${roomMemberPeerIds} + ${peerId}`)
    const newIds = roomMemberPeerIds.concat([peerId])
    console.log(`${newIds}`)
    setRoomMemberPeerIds(newIds)
  },[room, roomMemberPeerIds])

  // Leave
  const onPeerLeave = useCallback((peerId: string) => {
    console.log(`${roomMemberPeerIds} - ${peerId}`)
    const newIds =roomMemberPeerIds.filter((id) => {
      return id !== peerId
    })
    console.log(`${newIds}`)
    setRoomMemberPeerIds(newIds)
  },[room, roomMemberPeerIds])

  return (
    <x.div>
      skyway<br />
      <Members memberIds={roomMemberPeerIds}/>
      <PlaceConponent members={roomMemberPeerIds} />
    </x.div>
  )
}

type MembersProps = {
  memberIds: string[]
}
export const Members = ({memberIds}:MembersProps) => {
  return(
      memberIds ? <ul>
        {memberIds.map((id) => {
          return <li key={id}>{id}</li>
        })}
      </ul>: null
  )
} 