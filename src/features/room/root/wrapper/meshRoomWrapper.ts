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
  onRoomClose?: () => void
  onRoomMemberChange? : (meshRoomMembses: MeshRoomMembers) => void
  onPeerMemberInfoChange? : (peerId: string, meshRoomMember: MeshRoomMemberInfo) => void
}

export const meshRoomWrapper = (peer: Peer, roomId: string, option?: MeshRoomWrapperOption): Promise<ExMeshRoom> => {
  return new Promise((resolve, reject) => {
    meshRoomOpener(peer, roomId, option?.stream).then((room) => {
      option?.onRoomClose && room.on('close', option?.onRoomClose)

      // 拡張 : meshRoom.exMethod として meshRoom を拡張する
      const exMeshRoom: ExMeshRoom = room
      exMeshRoom['exMethod'] = roomExtention(room, peer.id, {
        onMeshRoomMemberChange: option.onRoomMemberChange,
        onMeshRoomMemberInfoChange: option.onPeerMemberInfoChange
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
}

export type ExMeshRoom = MeshRoom & {
  exMethod?: ExMethods
}

type ExMethods = {
  addMember: (peerId: string, meshRoomMember: MeshRoomMemberInfo) => void
  removeMember: (peerId: string) => void
  setMyName: (name: string) => void
  changeMemberName: (peerId: string, name: string) => void
  getMyName: () => string
}

type RoomExtention = (room: MeshRoom, peerId: string, option?: {
  onMeshRoomMemberChange?: (meshRoomMembers: MeshRoomMembers)=> void
  onMeshRoomMemberInfoChange?: (peerId: string, meshRoomMember: MeshRoomMemberInfo)=> void
}) => ExMethods

const roomExtention: RoomExtention = (room, peerId: string, option?) => {
  let meshRoomMembers: MeshRoomMembers = {}
  let __myName: string = ''

  // Member
  room.on('data', ({ src, data }) => {
    if(data.dataType && data.to){
      switch(`${data.dataType}-${data.to}`){
        case 'ping-all': 
          const ping_res_data:LibSendData = {
            dataType: 'res_ping',
            to: src,
            name: getMyName()
          }
          room.send(ping_res_data)
          addMember(src, {name: data.name})
          break;
        case `res_ping-${peerId}`:
          addMember(src, {name: data.name})
          break;
        case `change_name-all`:
          changeMemberName(src, data.name)
          break;
      }
    }
  })

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
    const changeMemberInfo: MeshRoomMemberInfo = {
      name
    }
    let changeNameMembers = {}
    changeNameMembers[peerId] = changeMemberInfo
    const newMembers = Object.assign({}, meshRoomMembers, changeNameMembers)
    meshRoomMembers = newMembers

    option.onMeshRoomMemberInfoChange && option.onMeshRoomMemberInfoChange(peerId, changeMemberInfo)
  }

  const getMyName = () => {
    return __myName
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
    getMyName
  }
}

// ライブラリが送信するデータ
type LibSendDataDataType = 'ping' | 'res_ping' | 'res_ping' | 'change_name'
type LibSendData = {
  dataType: LibSendDataDataType
  to: 'all' | string
  name: string
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
