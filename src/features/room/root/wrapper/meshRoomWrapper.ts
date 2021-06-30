import { constSelector } from "recoil"
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
  startPosition?: Position
  onRoomClose?: () => void
  onRoomMemberChange? : (meshRoomMembses: MeshRoomMembers) => void
  onPeerMemberInfoChange? : (peerId: string, meshRoomMember: MeshRoomMemberInfo) => void
  onMeshRoomData?: (src: string, data: {}) => void
}

export const meshRoomWrapper = (peer: Peer, roomId: string, option?: MeshRoomWrapperOption): Promise<ExMeshRoom> => {
  return new Promise((resolve, reject) => {
    meshRoomOpener(peer, roomId, option?.stream).then((room) => {
      option?.onRoomClose && room.on('close', option?.onRoomClose)

      // 拡張 : meshRoom.exMethod として meshRoom を拡張する
      const exMeshRoom: ExMeshRoom = room
      exMeshRoom['exMethod'] = roomExtention(room, peer.id, {
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
export type MeshRoomMembers = {
  [peerId: string]: MeshRoomMemberInfo
}

export type MeshRoomMemberInfo = {
  name: string
  position?: Position
}

export type Position = {
  x: number
  y: number
  z: number
}

export type ExMeshRoom = MeshRoom & {
  exMethod?: ExMethods
}

type ExMethods = {
  addMember: (peerId: string, meshRoomMember: MeshRoomMemberInfo) => void
  removeMember: (peerId: string) => void
  setMyName: (name: string) => void
  changeMemberName: (peerId: string, name: string) => void
  getMyName: () => string,
  moveTo: (position: Position) => void
}

type RoomExtention = (room: MeshRoom, peerId: string, option?: {
  myName?: string
  startPosition?: Position
  onMeshRoomMemberChange?: (meshRoomMembers: MeshRoomMembers)=> void
  onMeshRoomMemberInfoChange?: (peerId: string, meshRoomMember: MeshRoomMemberInfo)=> void
  onMeshRoomData?: (src: string, data: {}) => void
}) => ExMethods

const roomExtention: RoomExtention = (room, peerId: string, option?) => {
  let meshRoomMembers: MeshRoomMembers = {}
  let __myName: string = option?.myName || ''
  let __myPosition: Position = option.startPosition

  const onData = ({ src, data }) => {
    if(data.dataType && data.to){
      
      const recieveLibSendData: LibSendData = data
      if(recieveLibSendData.to === 'all' || recieveLibSendData.to === peerId){ 
        switch(`${recieveLibSendData.dataType}`){
          case 'ping': 
            const ping_res_data:LibSendData = {
              dataType: 'res_ping',
              to: src,
              name: getMyName()
            }
            room.send(ping_res_data)
            addMember(src, {
              name: data.name,
              position: __myPosition
            })
            break;
          case `res_ping`:
            addMember(src, {
              name: data.name,
              position: __myPosition
            })
            break;
          case `change_name`:
            changeMemberName(src, data.name)
            break;
          case 'move_to':
            changeMemberPosition(src, data.position)
            break;
        }
      }
    } else {
      option.onMeshRoomData && option.onMeshRoomData(src, data)
    }
  }

  // Member
  room.on('data', onData)

  // 退室メンバー処理
  room.on('peerLeave', peerId => {
    removeMember(peerId)
  })

  // ユーザーを追加する
  const addMember = (peerId: string, meshRoomMember: MeshRoomMemberInfo) => {
    const add = {}
    add[peerId] = meshRoomMember
    const newMembers = Object.assign({}, meshRoomMembers, add)
    meshRoomMembers = newMembers
    option.onMeshRoomMemberChange && option.onMeshRoomMemberChange(newMembers)
  }

  // ユーザーを削除する
  const removeMember = (peerId: string) => {
    const newMembers = Object.assign({}, meshRoomMembers)
    delete newMembers[peerId]
    meshRoomMembers = newMembers
    option.onMeshRoomMemberChange && option.onMeshRoomMemberChange(newMembers)
  }

  // 自身の名前をセットする
  const setMyName = (myName: string) => {
    __myName = myName
    const change_name_data:LibSendData = {
      dataType: 'change_name',
      to: 'all',
      name: myName
    }
    room.send(change_name_data)
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
  
  const changeMemberPosition = (peerId: string, position: Position) => {
    const old = Object.assign({}, meshRoomMembers[peerId], {position})
    const newP = {}
    newP[peerId] = old
    const newMembers = Object.assign({}, meshRoomMembers, newP)
    meshRoomMembers = newMembers
    __myPosition = position
    option.onMeshRoomMemberInfoChange && option.onMeshRoomMemberInfoChange(peerId, old)
  }

  const getMyName = () => {
    return __myName
  }

  const moveTo = (position: Position) => {
    const moveTo_data:LibSendData = {
      dataType: 'move_to',
      to: 'all',
      position
    }
    room.send(moveTo_data)
  }

  // Ping 送信
  const data:LibSendData = {
    dataType: "ping",
    to: 'all',
    name: getMyName()
  }
  room.send(data)

  return {
    addMember,
    removeMember,
    setMyName,
    changeMemberName,
    getMyName,
    moveTo
  }
}

// ライブラリが送信するデータ
type LibSendDataDataType = 'ping' | 'res_ping' | 'res_ping' | 'change_name' | 'move_to'
type LibSendData = {
  dataType: LibSendDataDataType
  to: 'all' | string
  name?: string
  position?: Position
}

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
