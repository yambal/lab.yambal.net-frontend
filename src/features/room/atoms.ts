import { atom, useRecoilState } from 'recoil'
import Peer from 'skyway-js';

export const peerState = atom<Peer | undefined>({
  key: "peer",
  default: undefined,
});

export type RoomMember = {
  name: string
}

export type RoomMemberState = {
  [peerId: string]: RoomMember
}

export const roomMembersState = atom<RoomMemberState>({
  key: "roomRoomMembers",
  default: {}
});

/*
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





*/