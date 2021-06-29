import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useUnmount } from 'react-use';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import Peer, { MeshRoom } from 'skyway-js'
import { meshRoomIdState, meshRoomMemberIdsState, meshRoomMemberStateByPeerId } from '../../atoms'
import { ExMeshRoom, MeshRoomMemberInfo, MeshRoomMembers, meshRoomWrapper } from '../wrapper/meshRoomWrapper';

type RoomData = {
  dataType: 'ping' | 'res_ping'
  to: string | 'all'
  name: string
}

let __room: MeshRoom | undefined = undefined;

type MeshRoomContainerProps = {
  peer: Peer | undefined
  roomId: string
  peerUserNameLabel: string
}

export const MeshRoomInitializer = ({peer, roomId, peerUserNameLabel}:MeshRoomContainerProps) => {
  const [room, setRoom] = useState<ExMeshRoom>()
  const setMeshRoomMemberPeerIds = useSetRecoilState(meshRoomMemberIdsState)
  const setMeshRoomId = useSetRecoilState(meshRoomIdState)

  useEffect(() => {
    if(peer){
      meshRoomWrapper(peer, roomId, {
        onRoomClose,
        onRoomMemberChange,
        onPeerMemberInfoChange
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

  return (
    <Fragment />
  );
}
