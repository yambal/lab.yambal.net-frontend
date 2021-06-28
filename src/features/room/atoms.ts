import { atom, atomFamily, selector, selectorFamily, useRecoilState } from 'recoil'
import Peer, { MeshRoom } from 'skyway-js';
import { MeshRoomMember, MeshRoomMembers } from './root/wrapper/meshRoomWrapper';

/*
export const peerState = atom<Peer | undefined>({
  key: "peer",
  default: undefined,
});

export type RoomMember = {
  name: string
}
*/
export const peerUserNameLabelState = atom<string>({
  key: "peerUserNameLabel",
  default: undefined
})

/*
export const meshRoomMembersState = atom<MeshRoomMembers>({
  key: "meshRoomMembers",
  default: {}
});
*/

export const meshRoomIdState = atom<string>({
  key: "meshRoomId",
  default: undefined
});

export const meshRoomMemberIdsState = atom<string[]>({
  key: 'meshRoomMemberIds',
  default: []
});

//
export const meshRoomMemberStateByPeerId = atomFamily<MeshRoomMember, string>({
  key: "roomMemberFamiky",
  default: undefined
});

/*
export const stateTodos = selector<Todo[]>({
  key: "state-todos",
  get: ({ get }) => {
    const todoIds = get(stateTodoIds);
    return todoIds.map((todoId) => get(stateTodo(todoId)));
  },
}
*/