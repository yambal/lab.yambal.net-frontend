import React, { useState, useEffect, useCallback, Fragment, useTransition } from 'react';
import { useUnmount } from 'react-use';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import Peer, { MeshRoom } from 'skyway-js'
import { distanceFamilyById, ExDistance, meshRoomIdState, meshRoomMemberIdsState, meshRoomMemberStateByPeerId, meshRoomMyPositionState, positionFamilyById } from '../../peerAtom'
import { exMeshRoomOpener } from '../wrapper/exMeshRoomOpener'
import { ExMeshRoom, ExMember, ExMembers, ExMemberPosition } from '../wrapper/exMeshRoomTypes'

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
  const setMeshRoomMemberPeerIds = useSetRecoilState(meshRoomMemberIdsState)
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
        onRoomMemberChange,
        onPeerMemberInfoChange,
        onPositionChange,
        onDistanceChange,
        onMeshRoomData,
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

  const onMeshRoomData = useCallback((src: String, data: {}) => {

  },[])

  const onPeerLeave = useCallback((peerId: string) => {

  },[])

  // Room のメンバーに変更があった時
  const onRoomMemberChange = useRecoilCallback(({ set }) => (meshRoomMembers: ExMembers) => {
    const newPeerIds = Object.keys(meshRoomMembers)
    startTransition(() => {
      // 遅延
      setMeshRoomMemberPeerIds(newPeerIds)

      // MeshRoomMember を peerId で確認する
      // const member = useRecoilValue(meshRoomMemberStateByPeerId(peerId));
      newPeerIds.forEach((newPeerId) => {
        set(meshRoomMemberStateByPeerId(newPeerId), meshRoomMembers[newPeerId]);
      })
    })
  });

  // Room のメンバーの情報に変更があった時
  const onPeerMemberInfoChange = useRecoilCallback(({ set }) => (peerId: string, meshRoomMember: ExMember) => {
    startTransition(() => {
      // 遅延
      set(meshRoomMemberStateByPeerId(peerId), meshRoomMember)
    })
  })

  // 座標に変化があった時
  const onPositionChange = useRecoilCallback(({ set }) => (peerId: string, position: ExMemberPosition) => {
    set(positionFamilyById(peerId), position)
  })

  // 距離に変化があった時
  const onDistanceChange = useRecoilCallback(({ set }) => (peerId: string, distance: number) => {
    set(distanceFamilyById(peerId), distance > 150 ? 'out' : 'in')
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
