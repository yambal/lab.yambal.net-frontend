import { SystemProps, x } from '@xstyled/styled-components'
import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { PeerMethods } from '../lib/peerWrapper'
import { meshRoomWraper, DataObject, Log } from '../lib/meshRoomWraper'
import { useRecoilState } from 'recoil'
import { MeshRoomMethodsState, MeshRoomIsOpenState, MeshRoomLogsState } from '../store/skywayAtoms'
import { useUnmount } from 'react-use';

// MeshRoomInitializer ======================================
type MeshRoomInitializerProps = {
  roomId: string
  children: ReactNode
  peerMethods: PeerMethods
  peerIsOpen: boolean
  peerId: string
}
export const MeshRoomInitializer = ({
  roomId,
  children,
  peerMethods,
  peerIsOpen,
  peerId
}: MeshRoomInitializerProps) => {

  const [meshRoomMethods, setMeshRoomMethods] = useRecoilState(MeshRoomMethodsState)
  const [roomIsOpen, setRoomIsOpen] = useRecoilState(MeshRoomIsOpenState)
  const [meshRoomLogs, setMeshRoomLogs] = useRecoilState(MeshRoomLogsState)
  
  useEffect(() => {
    console.log(30)
    if(peerMethods && peerIsOpen) {
      const _room = meshRoomWraper(peerMethods.getPeer(), peerId)
      _room.joinMethRoom({
        roomId,
        onRoomOpenListener: onRoomOpen,
        onRoomPeerJoinListener: onRoomPeerJoin,
        onRoomPeerLeaveListener: onRoomPeerLeave,
        onRoomLogListener: onRoomLog,
        onStreamListener: onStream,
        onDataListener: onData,
        onRoomCloseListener: onRoomClose
      })
      .then((meshRoomMethod) => {
        setMeshRoomMethods(meshRoomMethod)
      })
    }
  },[peerMethods, peerIsOpen])

  const onRoomOpen = () => {
    console.log(`-- onRoomOpen --`)
    setRoomIsOpen(true)
  }

  const onRoomPeerJoin = (peerId: string) => {
    console.log(`-- onRoomPeerJoin ${peerId} --`)
  }

  const onRoomPeerLeave = (peerId: string) => {
    console.log(`-- onRoomPeerLeave ${peerId} --`)
  }

  const onRoomLog = (logs: Log[]) => {
    console.log(`-- onRoomLog ${JSON.stringify(logs)} --`)
    setMeshRoomLogs(logs)
  }

  const onStream = (stream: MediaStream) => {
    console.log(`-- onStream ${stream} --`)
  }

  const onData = (from: string, to:string, dataObject: DataObject) => {
    console.log(`-- onData from ${from} to ${to} data ${JSON.stringify(dataObject.data)} --`)
  }

  const onRoomClose = () => {
    console.log(`-- onRoomClose --`)
    setRoomIsOpen(false)
    setMeshRoomMethods(undefined)
    setMeshRoomLogs([])
  }

  useUnmount(() => {
    meshRoomMethods.close()
  })



  return (
    <React.Fragment>
      {roomIsOpen && 'open'}
      {children}
    </React.Fragment>
  )
}
