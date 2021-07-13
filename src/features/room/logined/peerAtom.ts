import { atom, atomFamily, selector, selectorFamily, useRecoilState } from 'recoil'
import Peer, { MeshRoom } from 'skyway-js';
import { ExDistance, ExMemberPosition, ExMethods } from '../root/wrapper/exMeshRoomTypes';

export const peerMyNameState = atom<string>({
  key: "peerMyName",
  default: undefined
})

export const peerAvatarUrlState = atom<string>({
  key: "peerAvatarUrl",
  default: undefined
})

export const meshRoomIdState = atom<string>({
  key: "meshRoomId",
  default: undefined
})

export const exMeshodsState = atom<ExMethods>({
  key: "exMeshods",
  default: undefined
})

export const meshRoomMemberIdsState = atom<string[]>({
  key: 'meshRoomMemberIds',
  default: []
});

export const meshRoomMyPositionState = atom<ExMemberPosition>({
  key: 'meshRoomMyPosition',
  default: {
    x: 0,
    y: 0,
    z: 0
  }
})

// Members Name
export const nameFamilyById = atomFamily<string, string>({
  key: "nameFamily",
  default: undefined
})

export const avatarUrlFamilyById = atomFamily<string, string>({
  key: "avatarUrlFamily",
  default: undefined
});

// Members Position
export const positionFamilyById = atomFamily<ExMemberPosition, string>({
  key: "positionFamily",
  default: undefined
});

// Distance

export const distanceFamilyById = atomFamily<ExDistance, string>({
  key: "distanceFamily",
  default: undefined
})



