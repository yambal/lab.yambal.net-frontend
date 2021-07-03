import { atom, atomFamily, selector, selectorFamily, useRecoilState } from 'recoil'
import Peer, { MeshRoom } from 'skyway-js';
import { ExMember, ExMembers, ExMemberPosition } from './root/wrapper/meshRoomWrapper';

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

// Member 
export const meshRoomMemberStateByPeerId = atomFamily<ExMember, string>({
  key: "roomMemberFamiky",
  default: undefined
});

export const meshRoomMyPositionState = atom<ExMemberPosition>({
  key: 'meshRoomMyPosition',
  default: {
    x: 0,
    y: 0,
    z: 0
  }
})

// Distance
export type ExDistance = 'out' | 'in'
export const distanceFamilyById = atomFamily<ExDistance, string>({
  key: "distanceFamily",
  default: undefined
});