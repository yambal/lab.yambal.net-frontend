import Peer, { MeshRoom } from "skyway-js"

/**
 * meshRoomWrapper
 * meshRoom を開き、拡張した ExMeshRoom を返す
 * @param peer 
 * @param roomId 
 * @param option 
 * @returns 
 */

 type MeshRoomWrapperOption = {
  stream?: MediaStream
  myName?: string
  startPosition?: ExMemberPosition
  onRoomClose?: () => void
  onRoomMemberChange? : (meshRoomMembses: ExMembers) => void
  onPeerMemberInfoChange? : (peerId: string, meshRoomMember: ExMember) => void
  onMeshRoomData?: (src: string, data: {}) => void
}

export const exMeshRoomOpener = (peer: Peer, roomId: string, option?: MeshRoomWrapperOption): Promise<ExMeshRoom> => {
  return new Promise((resolve, reject) => {
    meshRoomOpener(peer, roomId, option?.stream).then((room) => {
      option?.onRoomClose && room.on('close', option?.onRoomClose)

      // 拡張 : meshRoom.exMethod として meshRoom を拡張する
      const exMeshRoom: ExMeshRoom = room
      exMeshRoom['ex'] = roomExtention(room, peer.id, {
        myName: option?.myName,
        startPosition: option?.startPosition,
        onMeshRoomMemberChange: option.onRoomMemberChange,
        onMeshRoomMemberInfoChange: option.onPeerMemberInfoChange,
        onMeshRoomData: option.onMeshRoomData
      })

      resolve(
        exMeshRoom
      )
    })
  })
}

/**
 * roomExtention
 * @param room 
 * @param option 
 * @returns 
 */

// ライブラリ内で管理するメンバーリスト
export type ExMembers = {
  [peerId: string]: ExMember
}

// ライブラリ内で管理するメンバー
export type ExMember = {
  name: string
  position?: ExMemberPosition
}

export type ExMemberPosition = {
  x: number
  y: number
  z: number
}

export type ExMeshRoom = MeshRoom & {
  ex?: ExMethods
}

type ExMethods = {
  addMember: (peerId: string, meshRoomMember: ExMember) => void
  removeMember: (peerId: string) => void
  setMyName: (name: string) => void
  changeMemberName: (peerId: string, name: string) => void
  getMyName: () => string,
  moveTo: (position: ExMemberPosition) => void,
  sendPing: () => void
}

type RoomExtention = (room: MeshRoom, peerId: string, option?: {
  myName?: string
  startPosition?: ExMemberPosition
  onMeshRoomMemberChange?: (meshRoomMembers: ExMembers)=> void
  onMeshRoomMemberInfoChange?: (peerId: string, meshRoomMember: ExMember)=> void
  onMeshRoomData?: (src: string, data: {}) => void
}) => ExMethods

// ライブラリが送信するデータ
type LibSendDataDataType = 'ping' | 'res_ping' | 'res_ping' | 'change_name' | 'move_to'
type LibSendData = {
  dataType: LibSendDataDataType
  to: 'all' | string
  name?: string
  position?: ExMemberPosition
}

const roomExtention: RoomExtention = (room, peerId: string, option?) => {
  let meshRoomMembers: ExMembers = {}
  let __myName: string = option?.myName || ''
  let __myPosition: ExMemberPosition = option.startPosition

  // on data : 他のユーザーから送信されたデータを受信した時に発生します。
  room.on('data', ({ src, data }) => {
    onData(src, data)
  })

  // on peerLeave : 新規に Peer がルームを退出したときに発生します。
  room.on('peerLeave', peerId => {
    removeMember(peerId)
  })

  // ルームに Join している他のユーザのストリームを受信した時に発生します。 ストリーム送信元の Peer ID はstream.peerIdで取得できます。
  room.on('stream', stream => {
    console.log(`on stream ${stream.id}`)
  
    var audio = document.createElement("audio");
    audio.srcObject = stream
    audio.play()

  })

  // =============================================================================
  const onData = (src, data) => {
    if(data.dataType && data.to){
      const recieveLibSendData: LibSendData = data
      if(recieveLibSendData.to === 'all' || recieveLibSendData.to === peerId){ 
        switch(`${recieveLibSendData.dataType}`){
          case 'ping': 
            // Pingを受信
            resPing(src)
            const addM:ExMember = {
              name: recieveLibSendData.name,
              position: recieveLibSendData.position
            }
            addMember(src, addM)
            break;
          case `res_ping`:
            // Ping応答を受信
            const resM:ExMember = {
              name: recieveLibSendData.name,
              position: recieveLibSendData.position
            }
            addMember(src, resM)
            break;
          case `change_name`:
            // 名前変更を受信
            changeMemberName(src, data.name)
            break;
          case 'move_to':
            // 移動を受信
            changeMemberPosition(src, data.position)
            break;
        }
      }
    } else {
      option.onMeshRoomData && option.onMeshRoomData(src, data)
    }
  }

  // メンバーを追加する
  const addMember = (peerId: string, meshRoomMember: ExMember) => {
    const add = {}
    add[peerId] = meshRoomMember
    const newMembers = Object.assign({}, meshRoomMembers, add)
    meshRoomMembers = newMembers
    option.onMeshRoomMemberChange && option.onMeshRoomMemberChange(newMembers)
  }

  // メンバーを削除する
  const removeMember = (peerId: string) => {
    const newMembers = Object.assign({}, meshRoomMembers)
    delete newMembers[peerId]
    meshRoomMembers = newMembers
    option.onMeshRoomMemberChange && option.onMeshRoomMemberChange(newMembers)
  }

  // メンバーの名前を変更する
  const changeMemberName = (peerId: string, name: string) => {
    const old = Object.assign({}, meshRoomMembers[peerId], {name})
    const newP = {}
    newP[peerId] = old
    const newMembers = Object.assign({}, meshRoomMembers, newP)
    meshRoomMembers = newMembers

    option.onMeshRoomMemberInfoChange && option.onMeshRoomMemberInfoChange(peerId, old)
  }
  
  // メンバーの座標を変更する
  const changeMemberPosition = (peerId: string, position: ExMemberPosition) => {
    const old = Object.assign({}, meshRoomMembers[peerId], {position})
    const newP = {}
    newP[peerId] = old
    const newMembers = Object.assign({}, meshRoomMembers, newP)
    meshRoomMembers = newMembers
    option.onMeshRoomMemberInfoChange && option.onMeshRoomMemberInfoChange(peerId, old)
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
      room.send(moveTo_data)
      lastMoveToSend = new Date().getTime()
    } else {
      // skip
      timerId = setTimeout(() => {
        room.send(moveTo_data)
        lastMoveToSend = new Date().getTime()
      }, 101)
    }
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
    addMember,
    removeMember,
    setMyName,
    changeMemberName,
    getMyName,
    moveTo,
    sendPing
  }
}

// =============================================================================
/**
 * meshRoomOpener
 * new peer.joinRoom を Promise 化したもの
 * @param peer 
 * @param roomId 
 * @param stream 
 * @returns 
 */

export const meshRoomOpener = (peer: Peer, roomId: string, stream?: MediaStream): Promise<MeshRoom> => {
  return new Promise((resolve, reject) => {
    const room: MeshRoom = peer.joinRoom(roomId, {
      mode: 'mesh',
      stream
    })
    room.once('open', () => {
      resolve(room)
    })
  })
}
