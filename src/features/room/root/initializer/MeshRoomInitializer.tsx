import React, { useState, useEffect, useCallback, Fragment, useTransition } from 'react';
import { useUnmount } from 'react-use';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import Peer, { MeshRoom } from 'skyway-js'
import { meshRoomIdState, meshRoomMemberIdsState, meshRoomMemberStateByPeerId, meshRoomMyPositionState } from '../../peerAtom'
import { ExMeshRoom, ExMember, ExMembers, exMeshRoomOpener, ExMemberPosition } from '../wrapper/meshRoomWrapper';

let __room: MeshRoom | undefined = undefined;

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
        onMeshRoomData
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
    if(exMeshRoom) {
      exMeshRoom.ex.moveTo(myPosition)
    }
  },[myPosition, exMeshRoom])

  const onMeshRoomData = useCallback((src: String, data: {}) => {

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
      set(meshRoomMemberStateByPeerId(peerId), meshRoomMember);
    })
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
