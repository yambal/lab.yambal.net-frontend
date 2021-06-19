import { atom, useRecoilState } from 'recoil'

export const peerIsOpenState = atom<boolean>({
  key: "peerIsOpen",
  default: false,
});

export const peerMyPeerIdState = atom<string | undefined>({
  key: "peerMyPeerId",
  default: undefined,
});

export const roomIsOpenState = atom<boolean>({
  key: "RoomrIsOpen",
  default: false,
});


export type RoomMember = {
  name: string
  peerId: string
  position: {
    x: number
    y: number
  }
}


export type RoomMemberState = {
  [peerId: string]: RoomMember
}

export const roomMembersState = atom<RoomMemberState>({
  key: "roomRoomMembers",
  default: {}
});