import { atom, atomFamily, selector, selectorFamily, useRecoilState } from 'recoil'
import Peer, { MeshRoom } from 'skyway-js';
import { MeshRoomMemberInfo, MeshRoomMembers, Position } from './root/wrapper/meshRoomWrapper';

export const peerUserNameLabelState = atom<string>({
  key: "peerUserNameLabel",
  default: undefined
})


export const meshRoomIdState = atom<string>({
  key: "meshRoomId",
  default: undefined
});

export const meshRoomMemberIdsState = atom<string[]>({
  key: 'meshRoomMemberIds',
  default: []
});

//
export const meshRoomMemberStateByPeerId = atomFamily<MeshRoomMemberInfo, string>({
  key: "roomMemberFamiky",
  default: undefined
});

export const meshRoomMyPositionState = atom<Position>({
  key: 'meshRoomMyPosition',
  default: {
    x: 0,
    y: 0,
    z: 0
  }
});