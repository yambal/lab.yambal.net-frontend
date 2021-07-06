import Peer, { MeshRoom } from "skyway-js"
import { roomExtention } from "./exMeshRoom"
import { ExMeshRoom, ExMeshRoomOpenerOption } from "./exMeshRoomTypes"
/**
 * meshRoomWrapper
 * meshRoom を開き、拡張した ExMeshRoom を返す
 * @param peer 
 * @param roomId 
 * @param option 
 * @returns 
 */



export const exMeshRoomOpener = (peer: Peer, roomId: string, option?: ExMeshRoomOpenerOption): Promise<ExMeshRoom> => {
  const { onIdsChange, onNameChange, onPositionChange, onDistanceChange, onData, onStream, onPeerLeave } = option
  
  return new Promise((resolve, reject) => {
    

    meshRoomOpener(peer, roomId, option?.stream).then((room) => {
      option?.onRoomClose && room.on('close', option?.onRoomClose)

      // 拡張 : meshRoom.exMethod として meshRoom を拡張する
      const exMeshRoom: ExMeshRoom = room
      exMeshRoom['ex'] = roomExtention(room, peer.id, {
        myName: option?.myName,
        startPosition: option?.startPosition,
        onIdsChange,
        onNameChange,
        onPositionChange,
        onDistanceChange,
        onData,
        onStream,
        onPeerLeave
      })

      resolve(
        exMeshRoom
      )
    })
  })
}

// =============================================================================
/**
 * meshRoomOpener
 * new peer.joinRoom を Promise 化したもの
 * @param peer 
 * @param roomId 
 * @param stream 
 * @returns 
 */

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
