import { RoomExtention, LibSendData, ExMemberPosition, SkywayStream } from "./exMeshRoomTypes"

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
  let __memberAvatarUrls: {
    [peerId: string]: string
  } = {}
  let __memberStreams: {
    [peerId: string]: MediaStream
  } = {}

  let __myName: string = option?.myName || ''
  let __myPosition: ExMemberPosition = option.startPosition
  let __myAvaterUrl: string = option.avatarUrl

  // on data : 他のユーザーから送信されたデータを受信した時に発生します。
  room.on('data', ({ src, data }) => {
    onData(src, data)
  })

  // on peerLeave : 新規に Peer がルームを退出したときに発生します。
  room.on('peerLeave', peerId => {
    onPeerLeave(peerId)
  })

  // ルームに Join している他のユーザのストリームを受信した時に発生します。 ストリーム送信元の Peer ID はstream.peerIdで取得できます。
  room.on('stream', (stream:SkywayStream) => {
    onStream(stream)
  })

  // メンバーを削除する
  const onPeerLeave = (peerId: string) => {
    removeMember(peerId)
    option.onPeerLeave && option.onPeerLeave(peerId)
  }

  const onStream = (stream: SkywayStream) => {
    addStream(stream)
    option.onStream && option.onStream(stream)
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
            addMember(src, recieveLibSendData.name, recieveLibSendData.avaterUrl, recieveLibSendData.position)
            break;
          case `res_ping`:
            // Ping応答を受信
            addMember(src, recieveLibSendData.name, recieveLibSendData.avaterUrl, recieveLibSendData.position)
            break;
          case `change_name`:
            // 名前変更を受信
            setName(src, data.name)
            break;
          case 'move_to':
            // 移動を受信
            setPosition(src, recieveLibSendData.position)
            setDistance(src, recieveLibSendData.position)
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

  // メンバー
  const addMember = (peerId: string, name: string, avatarUrl: string, position: ExMemberPosition) => {
    setName(peerId, name)
    setAvatarUrl(peerId, avatarUrl)
    setPosition(peerId, position)
    setDistance(peerId, position)
    setId(peerId)
  }

  const removeMember = (peerId:string) => {
    removePosition(peerId)
    removeName(peerId)
    removeAvatarUrl(peerId)
    removeId(peerId)
    removeStream(peerId)
  }

  // Name
  const setName = (peerId: string, name: string) => {
    const add = {}
    add[peerId] = name
    const newMemberNames = Object.assign({}, __memberNames, add)
    __memberNames = newMemberNames
    option.onNameChange && option.onNameChange(peerId, name)
  }

  const removeName = (peerId: string) => {
    const newMemberNames = Object.assign({}, __memberNames)
    delete newMemberNames[peerId]
    __memberNames = newMemberNames
    /** Family 側は onPeerLeave で削除 */
  }

  const setAvatarUrl = (peerId: string, avatarUrl: string) => {
    const add = {}
    add[peerId] = avatarUrl
    const newMemberAvatarUrls = Object.assign({}, __memberAvatarUrls, add)
    __memberAvatarUrls = newMemberAvatarUrls
    option.onAvatarUrlChange && option.onAvatarUrlChange(peerId, avatarUrl)
  }

  const removeAvatarUrl  = (peerId: string) => {
    const newMemberAvatarUrls = Object.assign({}, __memberAvatarUrls)
    delete newMemberAvatarUrls[peerId]
    __memberAvatarUrls = newMemberAvatarUrls
    /** Family 側は onPeerLeave で削除 */
  }

  // 座標
  const setPosition = (peerId: string, position: ExMemberPosition) => {
    const add = {}
    add[peerId] = position
    const newMemberPositions = Object.assign({}, __memberPositions, add)
    __memberPositions = newMemberPositions
    option.onPositionChange && option.onPositionChange(peerId, position)
  }

  const removePosition = (peerId: string) => {
    const newMemberPositions = Object.assign({}, __memberPositions)
    delete newMemberPositions[peerId]
    __memberPositions = newMemberPositions
    /** Family 側は onPeerLeave で削除 */
  }

  // メンバーとの距離
  const setDistance = (peerId: string, position: ExMemberPosition) => {
    const distance = getDistance(position, getMyPosision())
    option.onDistanceChange && option.onDistanceChange(peerId, distance)
    /** Family 側は onPeerLeave で削除 */
  }

  // PeerIds
  const setId = (peerId: string) => {
    const newMembers = __meshRoomMembeIds.concat(peerId)
    __meshRoomMembeIds = newMembers
    option.onIdsChange && option.onIdsChange(__meshRoomMembeIds)
  }

  const removeId = (peerId: string) => {
    const removedIds = __meshRoomMembeIds.filter((id) => {
      return id != peerId
    })
    __meshRoomMembeIds = removedIds
    /** Family 側は onPeerLeave で削除 */
  }

  const addStream = (stream: SkywayStream) => {
    const newMemberStream ={}
    newMemberStream[stream.peerId] = stream
    __memberStreams = Object.assign({},__memberStreams, newMemberStream)
  }

  const removeStream = ((peerId: string) => {
    const newMemberStreams = Object.assign({}, __memberStreams)
    delete newMemberStreams[peerId]
    __memberStreams = newMemberStreams
  })



  // 通信
  // Ping 送信
  const sendPing = () => {
    const data:LibSendData = {
      dataType: "ping",
      to: 'all',
      name: getMyName(),
      avaterUrl: __myAvaterUrl,
      position: __myPosition
    }
    room.send(data)
  }

  // Ping に応答する
  const resPing = (to: string) => {
    const ping_res_data:LibSendData = {
      dataType: 'res_ping',
      to: to,
      name: getMyName(),
      avaterUrl: getMyAvatarUrl(),
      position: getMyPosision(),
    }
    room.send(ping_res_data)
  }

  let lastMoveToSend = undefined
  let timerId = undefined

  const iMoveTo = (position: ExMemberPosition) => {
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

  const getMyAvatarUrl = () => {
    return __myAvaterUrl
  }

  const getMyPosision = () => {
    return __myPosition
  }

  const getStream = (peerId: string) => {
    return __memberStreams[peerId]
  }

  sendPing()

  return {
    setMyName,
    setName,
    getMyName,
    getMyPosision,
    iMoveTo,
    sendPing,
    getStream
  }
}
