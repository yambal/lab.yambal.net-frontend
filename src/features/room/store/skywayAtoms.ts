import { atom, useRecoilState } from 'recoil'
import Peer from 'skyway-js';
import { PeerMethods } from '../lib/peerWrapper'
import { Log, MeshRoomMethod } from '../lib/meshRoomWraper';

//
export const PeerIsOpenState = atom<boolean>({
  key: "PeerIsOpen",
  default: false
})

export const PeerIdState = atom<string | undefined>({
  key: "PeerId",
  default: undefined
})

export const PeerMethodsState = atom<PeerMethods | undefined>({
  key: "peerMethods",
  default: undefined
})

//
export const MeshRoomIsOpenState = atom<boolean>({
  key: "MeshRoomIsOpen",
  default: false
})

export const MeshRoomMethodsState = atom<MeshRoomMethod | undefined>({
  key: "MeshRoomMethods",
  default: undefined
})

export const MeshRoomLogsState = atom<Log[]>({
  key: "MeshRoomLogs",
  default: []
})