import { RoomExtention, LibSendData, ExMemberPosition } from "./exMeshRoomTypes"

/**
 * roomExtention
 * @param room 
 * @param option 
 * @returns 
 */

export const roomExtention: RoomExtention = (room, peerId: string, option?) => {
  let __meshRoomMembeIds: string[] = []
  let __memberPositions: {
    [peerId: string]: ExMemberPosition
  } = {}
  let __memberNames: {
    [peerId: string]: string
  } = {}

  let __myName: string = option?.myName || ''
  let __myPosition: ExMemberPosition = option.startPosition

  // on data : 他のユーザーから送信されたデータを受信した時に発生します。
  room.on('data', ({ src, data }) => {
    onData(src, data)
  })

  // on peerLeave : 新規に Peer がルームを退出したときに発生します。
  room.on('peerLeave', peerId => {
    onPeerLeave(peerId)
  })

  // ルームに Join している他のユーザのストリームを受信した時に発生します。 ストリーム送信元の Peer ID はstream.peerIdで取得できます。
  room.on('stream', stream => {
    onStream(stream)
  })

  // メンバーを削除する
  const onPeerLeave = (peerId: string) => {
    deleteMemberPosition(peerId)

    // メンバーの基本情報
    const removedIds = __meshRoomMembeIds.filter((id) => {
      return id != peerId
    })
    __meshRoomMembeIds = removedIds
    option.onMemberChange && option.onMemberChange(removedIds)

    // Callback
    option.onPeerLeave && option.onPeerLeave(peerId, removedIds)
  }

  const onStream = (stream: MediaStream) => {
    console.log(`on stream ${stream.id}`)
    var audio = document.createElement("audio");
    audio.srcObject = stream
    audio.play()
  }

  // =============================================================================
  const onData = (src, data) => {
    if(data.dataType && data.to){
      const recieveLibSendData: LibSendData = data
      if(recieveLibSendData.to === 'all' || recieveLibSendData.to === peerId){ 
        switch(`${recieveLibSendData.dataType}`){
          case 'ping': 
            // Pingを受信
            resPing(src)
            addMember(src, recieveLibSendData.name, recieveLibSendData.position)
            break;
          case `res_ping`:
            // Ping応答を受信
            addMember(src, recieveLibSendData.name, recieveLibSendData.position)
            break;
          case `change_name`:
            // 名前変更を受信
            changeMemberName(src, data.name)
            break;
          case 'move_to':
            // 移動を受信
            // 位置をセット
            setMemberPosition(src, recieveLibSendData.position)

            // 距離をセット
            dispatchDistanceChange(src, recieveLibSendData.position)
            break;
        }
      }
    } else {
      option.onData && option.onData(src, data)
    }
  }

  const getDistance = (posA?: ExMemberPosition, posB?: ExMemberPosition): number | undefined => {
    if(posA && posB) {
      return Math.sqrt((posA.x - posB.x) * (posA.x - posB.x) + (posA.y - posB.y) * (posA.y - posB.y))
    }
    return undefined
  }
  const setMemberName = (peerId: string, name: string) => {
    const add = {}
    add[peerId] = name
    const newMemberNames = Object.assign({}, __memberNames, add)
    __memberNames = newMemberNames
    option.onNameChange && option.onNameChange(peerId, name)
  }

  // メンバーの座標更新と通知
  const setMemberPosition = (peerId: string, position: ExMemberPosition) => {
    const add = {}
    add[peerId] = position
    const newMemberPositions = Object.assign({}, __memberPositions, add)
    __memberPositions = newMemberPositions
    option.onPositionChange && option.onPositionChange(peerId, position)
  }

  const deleteMemberPosition = (peerId: string) => {
    const newMemberPositions = Object.assign({}, __memberPositions)
    delete newMemberPositions[peerId]
    __memberPositions = newMemberPositions
    /** TODO: Family 側も削除 */
  }

  // メンバーとの距離
  const dispatchDistanceChange = (peerId: string, position: ExMemberPosition) => {
    const distance = getDistance(position, getMyPosision())
    option.onDistanceChange && option.onDistanceChange(peerId, distance)
    /** TODO: Family 側も削除 */
  }

  // メンバーを追加する
  const addMember = (peerId: string, name: string, position: ExMemberPosition) => {
    // name
    setMemberName(peerId, name)

    // position
    setMemberPosition(peerId, position)

    // distance
    dispatchDistanceChange(peerId, position)

    // メンバーの基本情報
    const newMembers = __meshRoomMembeIds.concat(peerId)
    __meshRoomMembeIds = newMembers
    option.onMemberChange && option.onMemberChange(__meshRoomMembeIds)
  }

  // メンバーの名前を変更する
  const changeMemberName = (peerId: string, name: string) => {
    const newP = {}
    newP[peerId] = name
    const old = Object.assign({}, __memberNames, newP)
    __memberNames = old

    option.onNameChange && option.onNameChange(peerId, name)
  }

  // 通信
  // Ping 送信
  const sendPing = () => {
    const data:LibSendData = {
      dataType: "ping",
      to: 'all',
      name: getMyName()
    }
    room.send(data)
  }

  // Ping に応答する
  const resPing = (to: string) => {
    const ping_res_data:LibSendData = {
      dataType: 'res_ping',
      to: to,
      name: getMyName(),
      position: getMyPosision()
    }
    room.send(ping_res_data)
  }

  let lastMoveToSend = undefined
  let timerId = undefined
  const moveTo = (position: ExMemberPosition) => {
    __myPosition = position
    
    // send は 100ms 以上間を開けないと遅延する
    const moveTo_data:LibSendData = {
      dataType: 'move_to',
      to: 'all',
      position
    }
    if(timerId) {
      clearTimeout(timerId)
      timerId = undefined
    }
    if(!lastMoveToSend || new Date().getTime() - lastMoveToSend > 100){
      allMemberDistance()

      room.send(moveTo_data)
      lastMoveToSend = new Date().getTime()
    } else {
      // skip
      timerId = setTimeout(() => {
        allMemberDistance()

        room.send(moveTo_data)
        lastMoveToSend = new Date().getTime()
      }, 101)
    }
  }

  const allMemberDistance = () => {
    __meshRoomMembeIds.forEach((peerId) => {
      const memberPos = __memberPositions[peerId]
      const distance = getDistance(memberPos, getMyPosision())
      option.onDistanceChange &&  option.onDistanceChange(peerId, distance)
    })
  }

  const sendMyName = (myName: string) => {
    const change_name_data:LibSendData = {
      dataType: 'change_name',
      to: 'all',
      name: myName
    }
    room.send(change_name_data)
  }

  // 自身の名前をセットする
  const setMyName = (myName: string) => {
    __myName = myName
    sendMyName(myName)
  }

  const getMyName = () => {
    return __myName
  }

  const getMyPosision = () => {
    return __myPosition
  }

  sendPing()

  return {
    setMyName,
    changeMemberName,
    getMyName,
    getMyPosision,
    moveTo,
    sendPing
  }
}
