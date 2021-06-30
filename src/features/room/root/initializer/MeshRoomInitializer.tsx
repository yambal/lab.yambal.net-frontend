import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useUnmount } from 'react-use';
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Peer, { MeshRoom } from 'skyway-js'
import { meshRoomIdState, meshRoomMemberIdsState, meshRoomMemberStateByPeerId, meshRoomMyPositionState } from '../../atoms'
import { ExMeshRoom, MeshRoomMemberInfo, MeshRoomMembers, meshRoomWrapper, Position } from '../wrapper/meshRoomWrapper';

let __room: MeshRoom | undefined = undefined;

type MeshRoomContainerProps = {
  peer: Peer | undefined
  roomId: string
  peerUserNameLabel: string
  startPosition: Position
}

export const MeshRoomInitializer = ({peer, roomId, peerUserNameLabel, startPosition }:MeshRoomContainerProps) => {
  const [room, setRoom] = useState<ExMeshRoom>()
  const setMeshRoomMemberPeerIds = useSetRecoilState(meshRoomMemberIdsState)
  const setMeshRoomId = useSetRecoilState(meshRoomIdState)
  const myPosition = useRecoilValue(meshRoomMyPositionState)

  useEffect(() => {
    if(peer){
      console.log(`■ MeshRoomInitializer ■`)
      meshRoomWrapper(peer, roomId, {
        myName: peerUserNameLabel,
        startPosition,
        onRoomClose,
        onRoomMemberChange,
        onPeerMemberInfoChange,
        onMeshRoomData
      }).then((room) => {
        __room = room
        setRoom(__room)
        setMeshRoomId(roomId)
      })
    }
  },[peer])

  useEffect(() => {
    if(room) {
      // ユーザー名をセットする
      room.exMethod.setMyName(peerUserNameLabel)
    }
  },[peerUserNameLabel, room])

  useEffect(() => {
    if(room) {
      room.exMethod.moveTo(myPosition)
    }
  },[myPosition, room])

  const onMeshRoomData = useCallback((src: String, data: {}) => {

  },[])

  // Room のメンバーに変更があった時
  const onRoomMemberChange = useRecoilCallback(({ set }) => (meshRoomMembers: MeshRoomMembers) => {
    const newPeerIds = Object.keys(meshRoomMembers)

    setMeshRoomMemberPeerIds(newPeerIds)
    
    // MeshRoomMember を peerId で確認する
    // const member = useRecoilValue(meshRoomMemberStateByPeerId(peerId));
    newPeerIds.forEach((newPeerId) => {
      set(meshRoomMemberStateByPeerId(newPeerId), meshRoomMembers[newPeerId]);
    })
  });

  // Room のメンバーの情報に変更があった時
  const onPeerMemberInfoChange = useRecoilCallback(({ set }) => (peerId: string, meshRoomMember: MeshRoomMemberInfo) => {
    set(meshRoomMemberStateByPeerId(peerId), meshRoomMember);
  })

  // ルームが閉じられたとき
  const onRoomClose = useCallback(() => {
  },[room])

  // unMount
  useUnmount(() => {
    if(room){
      console.log(`-- room close --`)
      room.close()
    }
  })

  console.log('render')

  return (
    <Fragment />
  );
}
