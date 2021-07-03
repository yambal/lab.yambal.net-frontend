import { MeshRoom } from "skyway-js"

// ライブラリ内で管理するメンバーリスト
export type ExMembers = {
  [peerId: string]: ExMember
}

// ライブラリ内で管理するメンバー
export type ExMember = {
  name: string
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
  setMyName: (name: string) => void
  changeMemberName: (peerId: string, name: string) => void
  getMyName: () => string,
  getMyPosision: () => ExMemberPosition
  moveTo: (position: ExMemberPosition) => void,
  sendPing: () => void
}

type ExOption = {
  myName?: string
  startPosition?: ExMemberPosition
  onMemberChange: (meshRoomMemberIds: string[])=> void
  onNameChange: (peerId: string, name: string) => void,
  onPositionChange: (peerId, position: ExMemberPosition) => void,
  onDistanceChange: (peerId: string, distance:number) => void,
  onData: (src: string, data: {}) => void
  onPeerLeave: (leavePeerId: string, leavedPeerIds: string[]) => void
}

export type RoomExtention = (room: MeshRoom, peerId: string, option?: ExOption) => ExMethods

// ライブラリが送信するデータ
type LibSendDataDataType = 'ping' | 'res_ping' | 'res_ping' | 'change_name' | 'move_to'
export type LibSendData = {
  dataType: LibSendDataDataType
  to: 'all' | string
  name?: string
  position?: ExMemberPosition
}

export type ExMeshRoomOpenerOption = {
  stream?: MediaStream
  onRoomClose?: () => void
} & ExOption