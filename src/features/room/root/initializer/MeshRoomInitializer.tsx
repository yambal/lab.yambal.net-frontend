import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useUnmount } from 'react-use';
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';
import Peer, { MeshRoom } from 'skyway-js'
import { meshRoomIdState, meshRoomMemberIdsState, meshRoomMemberStateByPeerId } from '../../atoms'
import { ExMeshRoom, MeshRoomMembers, meshRoomWrapper } from '../wrapper/meshRoomWrapper';

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
        onRoomMemberChange
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
  const onRoomMemberChange = useRecoilCallback(({ set, snapshot }) => async(meshRoomMembers: MeshRoomMembers) => {
    const newPeerIds = Object.keys(meshRoomMembers)

    // 変更前のPeerId リスト
    let oldPeerIds = await snapshot.getLoadable(meshRoomMemberIdsState).toPromise()
    // 差分
    const diff = newPeerIds.filter(
      newPeerId => !oldPeerIds.includes( newPeerId )
    ).length + oldPeerIds.filter(
      oldPeerId => !newPeerIds.includes( oldPeerId )
    ).length
    if(diff != 0) {
      // 差分があれば PeerId リスト更新
      setMeshRoomMemberPeerIds(newPeerIds)
    }
    
    // MeshRoomMember を peerId で確認する
    // const member = useRecoilValue(meshRoomMemberStateByPeerId(peerId));
    newPeerIds.forEach((newPeerId) => {
      set(meshRoomMemberStateByPeerId(newPeerId), meshRoomMembers[newPeerId]);
    })
  });

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
