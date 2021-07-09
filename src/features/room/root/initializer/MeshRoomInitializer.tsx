import React, { useState, useEffect, useCallback, Fragment, useTransition } from 'react';
import { useMount, useUnmount } from 'react-use';
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Peer from 'skyway-js'
import {
  distanceFamilyById,
  exMeshodsState,
  meshRoomIdState,
  meshRoomMemberIdsState,
  meshRoomMyPositionState,
  nameFamilyById,
  positionFamilyById,
} from '../../peerAtom'
import { exMeshRoomOpener } from '../wrapper/exMeshRoomOpener'
import { ExMeshRoom, ExMemberPosition, ExDistance } from '../wrapper/exMeshRoomTypes'

let __room: ExMeshRoom | undefined = undefined;

type MeshRoomContainerProps = {
  peer: Peer | undefined
  stream?: MediaStream | undefined
  roomId: string
  myName: string
  startPosition: ExMemberPosition
}

export const MeshRoomInitializer = ({peer, stream, roomId, myName, startPosition }:MeshRoomContainerProps) => {
  const [exMeshRoom, setExMeshRoom] = useState<ExMeshRoom>()
  const [peerIds, setMeshRoomMemberPeerIds] = useRecoilState(meshRoomMemberIdsState)
  const [exMethods, setExMethods] = useRecoilState(exMeshodsState)
  const setMeshRoomId = useSetRecoilState(meshRoomIdState)
  const [myPosition, setMyPosition] = useRecoilState(meshRoomMyPositionState)

  const [isPending, startTransition] = useTransition();

  // peer
  useEffect(() => {
    if(peer){
      console.log(`■ MeshRoomInitializer ${roomId} ■`)
      exMeshRoomOpener(peer, roomId, {
        stream,
        myName,
        startPosition,
        onRoomClose,
        onIdsChange,
        onNameChange,
        onPositionChange,
        onDistanceChange,
        onData,
        onStream,
        onPeerLeave
      }).then((exMeshRoom) => {
        __room = exMeshRoom
        setExMeshRoom(__room)
        setMeshRoomId(roomId)
      })
    }
  },[peer])

  useMount(() => {
    setMyPosition(startPosition)
  })

  /**
   * Roomが初期化されたら拡張メソッドをStateに登録する
   */
  useEffect(() => {
    if(exMeshRoom) {
      setExMethods(exMeshRoom.ex)
    }
  },[exMeshRoom])

  useEffect(() => {
    if(exMethods) {
      // ユーザー名をセットする
      exMethods.setMyName(myName)
    }
  },[myName, exMethods])

  useEffect(() => {
    // 自分が移動したとき
    if(exMethods) {
      exMethods.iMoveTo(myPosition)
    }
  },[myPosition, exMethods])

  // データを受信したとき
  const onData = useCallback((src: String, data: {}) => {

  },[])

  const onStream = useCallback((stream: MediaStream) => {

  },[])

   // ルームが閉じられたとき
   const onRoomClose = useCallback(() => {
  },[exMeshRoom])

  // 
  const onPeerLeave = useRecoilCallback(({ reset, snapshot }) => async(leavePeerId: string) => {
    reset(nameFamilyById(leavePeerId))
    reset(positionFamilyById(leavePeerId))
    reset(distanceFamilyById(leavePeerId))

    const beforIds = await snapshot.getPromise(meshRoomMemberIdsState)
    const newIds = beforIds.filter((id) => {
      return id !== leavePeerId
    })
    setMeshRoomMemberPeerIds(newIds)
  })

  // Room のメンバーに変更があった時
  const onIdsChange = useCallback((peerIds: string[]) => {
    startTransition(() => {
      // 遅延
      setMeshRoomMemberPeerIds(peerIds)
    })
  },[peerIds, __room]);

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

    let newDistance:ExDistance = "out"
    if(distance < 50) {
      newDistance = "immediately"
    } else if(distance < 100) {
      newDistance = "standingTalk"
    } else if(distance < 200) {
      newDistance = "symposium"
    } else if(distance < 300) {
      newDistance = "festa"
    } else if(distance < 600) {
      newDistance = "neighborhood"
    }
    beforDistance !== newDistance && set(distanceFamilyById(peerId), newDistance)
  })

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
