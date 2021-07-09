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

export type ExMethods = {
  setMyName: (name: string) => void
  getMyName: () => string,
  getMyPosision: () => ExMemberPosition
  iMoveTo: (position: ExMemberPosition) => void,
  setName: (peerId: string, name: string) => void
  sendPing: () => void
  getStream: (peerId: string) => MediaStream
}

type ExOption = {
  myName?: string
  startPosition?: ExMemberPosition
  onIdsChange: (meshRoomMemberIds: string[])=> void
  onNameChange: (peerId: string, name: string) => void,
  onPositionChange: (peerId, position: ExMemberPosition) => void
  onDistanceChange: (peerId: string, distance:number) => void
  onData: (src: string, data: {}) => void
  onStream: (stream: MediaStream) => void
  onPeerLeave: (leavePeerId: string) => void
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

export type SkywayStream = MediaStream & {
  peerId: string
}

export type ExDistance = 'immediately' | 'standingTalk' | 'symposium' | 'festa' | 'neighborhood' | 'out'