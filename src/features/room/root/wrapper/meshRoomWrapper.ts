import Peer, { MeshRoom } from "skyway-js"

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

export type ExMeshRoom = MeshRoom & {
  exMethod?: ExMethods
}

export type MeshRoomMembers = {
  [peerId: string]: MeshRoomMember
}

export type MeshRoomMember = {
  name: string
}

type ExMethods = {
  addMember: (peerId: string, meshRoomMember: MeshRoomMember) => void
  removeMember: (peerId: string) => void
  setMyName: (name: string) => void
  changeMemberName: (peerId: string, name: string) => void
  getMyName: () => string
}

/**
 * roomExtention
 */
type RoomExtention = (room: MeshRoom, onMeshRoomMemberChange?: (meshRoomMembers: MeshRoomMembers)=> void) => ExMethods

const roomExtention: RoomExtention = (room, onMeshRoomMemberChange?) => {
  let meshRoomMembers: MeshRoomMembers = {}
  /** TODO: peerIds */
  let __myName: string = ''

  // 退室メンバー処理
  room.on('peerLeave', peerId => {
    removeMember(peerId)
  })

  // ユーザーを追加する
  const addMember = (peerId: string, meshRoomMember: MeshRoomMember) => {
    const add = {}
    add[peerId] = meshRoomMember
    const newMembers = Object.assign({}, meshRoomMembers, add)
    meshRoomMembers = newMembers
    onMeshRoomMemberChange && onMeshRoomMemberChange(newMembers)
  }

  // ユーザーを削除する
  const removeMember = (peerId: string) => {
    const newMembers = Object.assign({}, meshRoomMembers)
    delete newMembers[peerId]
    meshRoomMembers = newMembers
    onMeshRoomMemberChange && onMeshRoomMemberChange(newMembers)
  }

  // 自身の名前をセットする
  const setMyName = (myName: string) => {
    __myName = myName
    const change_name_data:any = {
      dataType: 'change_name',
      to: 'all',
      name: myName
    }
    room.send(change_name_data)
  }

  // メンバーの名前を返上する
  const changeMemberName = (peerId: string, name: string) => {
    let changeNameMembers = {}
    changeNameMembers[peerId] = {name}
    const newMembers = Object.assign({}, meshRoomMembers, changeNameMembers)
    meshRoomMembers = newMembers
    onMeshRoomMemberChange && onMeshRoomMemberChange(newMembers)
  }

  const getMyName = () => {
    return __myName
  }

  // Ping 送信
  const data:any = {
    dataType: "ping",
    to: 'all',
    name: getMyName()
  }
  console.log(`send: ${JSON.stringify(data)}`)
  room.send(data)

  return {
    addMember,
    removeMember,
    setMyName,
    changeMemberName,
    getMyName
  }
}

// ---------------------------------
type MeshRoomWrapperOption = {
  stream?: MediaStream,
  onRoomClose?: () => void,
  onRoomMemberChange? : (meshRoomMembses: MeshRoomMembers) => void
}

export const meshRoomWrapper = (peer: Peer, roomId: string, option?: MeshRoomWrapperOption): Promise<ExMeshRoom> => {
  return new Promise((resolve, reject) => {
    meshRoomOpener(peer, roomId, option?.stream).then((room) => {
      option?.onRoomClose && room.on('close', option?.onRoomClose)

      // 拡張
      const exMeshRoom: ExMeshRoom = room
      exMeshRoom['exMethod'] = roomExtention(room, option.onRoomMemberChange)

      // Member
      exMeshRoom.on('data', ({ src, data }) => {
        if(data.dataType && data.to){
          switch(`${data.dataType}-${data.to}`){
            case 'ping-all': 
              const ping_res_data:any = {
                dataType: 'res_ping',
                to: src,
                name: exMeshRoom.exMethod.getMyName()
              }
              exMeshRoom.send(ping_res_data)
              exMeshRoom.exMethod && exMeshRoom.exMethod.addMember(src, {name: data.name})
              break;
            case `res_ping-${peer.id}`:
              exMeshRoom.exMethod && exMeshRoom.exMethod.addMember(src, {name: data.name})
              break;
            case `change_name-all`:
              exMeshRoom.exMethod && exMeshRoom.exMethod.changeMemberName(src, data.name)
              break;
          }
        }
      })

      resolve(
        exMeshRoom
      )
    })
  })

}