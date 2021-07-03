import React, { useState, useEffect, useCallback, Fragment, useTransition } from 'react';
import { useUnmount } from 'react-use';
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Peer from 'skyway-js'
import { distanceFamilyById, meshRoomIdState, meshRoomMemberIdsState, meshRoomMyPositionState, nameFamilyById, positionFamilyById } from '../../peerAtom'
import { exMeshRoomOpener } from '../wrapper/exMeshRoomOpener'
import { ExMeshRoom, ExMemberPosition } from '../wrapper/exMeshRoomTypes'

let __room: ExMeshRoom | undefined = undefined;

type MeshRoomContainerProps = {
  peer: Peer | undefined
  stream: MediaStream | undefined
  roomId: string
  myName: string
  startPosition: ExMemberPosition
}

export const MeshRoomInitializer = ({peer, stream, roomId, myName, startPosition }:MeshRoomContainerProps) => {
  const [exMeshRoom, setExMeshRoom] = useState<ExMeshRoom>()
  const [peerIds, setMeshRoomMemberPeerIds] = useRecoilState(meshRoomMemberIdsState)
  const setMeshRoomId = useSetRecoilState(meshRoomIdState)
  const myPosition = useRecoilValue(meshRoomMyPositionState)
  
  const [isPending, startTransition] = useTransition({
    timeoutMs: 1000
  });

  // peer
  useEffect(() => {
    if(peer && stream){
      console.log(`■ MeshRoomInitializer ■`)
      exMeshRoomOpener(peer, roomId, {
        stream,
        myName,
        startPosition,
        onRoomClose,
        onMemberChange,
        onNameChange,
        onPositionChange,
        onDistanceChange,
        onData,
        onPeerLeave
      }).then((exMeshRoom) => {
        __room = exMeshRoom
        setExMeshRoom(__room)
        setMeshRoomId(roomId)
      })
    }
  },[peer, stream])

  useEffect(() => {
    if(exMeshRoom) {
      // ユーザー名をセットする
      exMeshRoom.ex.setMyName(myName)
    }
  },[myName, exMeshRoom])

  useEffect(() => {
    // 自分が移動したとき
    if(exMeshRoom) {
      exMeshRoom.ex.moveTo(myPosition)
    }
  },[myPosition, exMeshRoom])

  // データを受信したとき
  const onData = useCallback((src: String, data: {}) => {

  },[])

  // 
  const onPeerLeave = useRecoilCallback(({ reset }) => (leavePeerId: string, leavedPeerIds: string[]) => {
    reset(nameFamilyById(leavePeerId))
    reset(positionFamilyById(leavePeerId))
    reset(distanceFamilyById(leavePeerId))
  })

  // Room のメンバーに変更があった時
  const onMemberChange = useCallback((peerIds: string[]) => {
    startTransition(() => {
      // 遅延
      setMeshRoomMemberPeerIds(peerIds)
    })
  },[peerIds]);

  const onNameChange = useRecoilCallback(({ set }) => (peerId: string, name: string) => {
    set(nameFamilyById(peerId), name)
  },)

  // 座標に変化があった時
  const onPositionChange = useRecoilCallback(({ set }) => (peerId: string, position: ExMemberPosition) => {
    startTransition(() => {
      // 遅延
      set(positionFamilyById(peerId), position)
    })
  })

  // 距離に変化があった時
  const onDistanceChange = useRecoilCallback(({ set, snapshot }) => async(peerId: string, distance: number) => {
    const beforDistance = await snapshot.getPromise(distanceFamilyById(peerId))
    const newDistance = distance > 150 ? 'out' : 'in'
    beforDistance !== newDistance && set(distanceFamilyById(peerId), newDistance)
  })

  // ルームが閉じられたとき
  const onRoomClose = useCallback(() => {
  },[exMeshRoom])

  // unMount
  useUnmount(() => {
    if(exMeshRoom){
      console.log(`-- room close --`)
      exMeshRoom.close()
    }
  })

  return (
    <Fragment />
  );
}
