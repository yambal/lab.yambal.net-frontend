import Peer, { MeshRoom } from 'skyway-js'

type JoinMethRoomProps = {
  roomId: string
  onRoomOpenListener: () => void
  onRoomPeerJoinListener: (peerId: string) => void
  onRoomPeerLeaveListener: (peerId: string) => void
  onRoomLogListener: (logs: Log[]) => void
  onStreamListener: (stream: MediaStream) => void
  onDataListener: (from: string, to: string, dataObject: DataObject) => void
  onRoomCloseListener: () => void
}

export type DataObject = {
  src: string
  data: any
}

export type Log = {
  timestamp: Date
  messageType: string
  massege: {
    roomId: string
    roomType?: string,
    src: string
  }
}

export type MeshRoomMethod = {
  getRoom: () => MeshRoom
  close: () => void
  getLog: () => void
  replaceStream: (stream: MediaStream) => void
  send: (dataType: string, to: string,data: any) => void
}

export const meshRoomWraper = (peer:Peer, peerId: string) => {
  let _meshRoom: MeshRoom | undefined = undefined

  const _close = () => {
    _meshRoom.close()
  }

  const _getLog = () => {
    _meshRoom.getLog()
  }

  const _replaceStream = (stream: MediaStream) => {
    _meshRoom.replaceStream(stream)
  }

  const _sendBySystem = (dataType: string, to: string, data: any) => {
    const sendData = Object.assign(data, {dataType, to, timestamp: new Date(), senderSystem: 'system'})
    console.log(sendData)
    _meshRoom.send(sendData)
  }

  const _sendByUser = (to: string, data: any) => {
    const sendData = Object.assign(data, {to, timestamp: new Date(), senderSystem: 'vender'})
    _meshRoom.send(sendData)
  }

  const joinMethRoom = ({
      roomId,
      onRoomOpenListener,
      onRoomPeerJoinListener,
      onRoomPeerLeaveListener,
      onRoomLogListener,
      onStreamListener,
      onDataListener,
      onRoomCloseListener
    }: JoinMethRoomProps):Promise<MeshRoomMethod> => {

    const _getRoom = () => {
      return _meshRoom
    }

    // Listeners
    const _onMeshRoomOpen = () => {
      onRoomOpenListener && onRoomOpenListener()
      // _getLog()
      _sendBySystem(`${roomId}-system-ping`, `all`, {})
      
    }

    const _onMeshRoomPeerJoin = (peerId: string) => {
      onRoomPeerJoinListener && onRoomPeerJoinListener(peerId)
    }

    const _onRoomPeerLeave = (peerId: string) => {
      onRoomPeerLeaveListener && onRoomPeerLeaveListener(peerId)
    }

    const _onRoomLog = (jsonLogs: string[]) => {
      const logs = jsonLogs.map((jsonLog: string) => {
        const log = JSON.parse(jsonLog)
        const timestamp = new Date(log.timestamp)
        const fLog: Log = {
          timestamp,
          messageType: log.messageType,
          massege: {
            src: log.message.src,
            roomId: log.message.roomName,
            roomType: log.message.roomType
          }
        }
        return fLog
      })
      onRoomLogListener && onRoomLogListener(logs)
    }

    const _onStream = (stream: MediaStream) => {
      onStreamListener && onStreamListener(stream)
    }

    const _onData = (dataObject: DataObject) => {
      console.log(116)
      const to = dataObject.data.to
      const senderSystem = dataObject.data.senderSystem
      const dataType = dataObject.data.dataType
      if (to === 'all' || to === peerId) {
        const from = dataObject.src
        delete dataObject.data.to
        delete dataObject.data.dataType
        delete dataObject.data.senderSystem

        if(senderSystem !== 'system') {
          onDataListener && onDataListener(from, to, dataObject)
        } else {
          console.log(`-- onData(system) from ${from} to ${to} dataType ${dataType} data ${JSON.stringify(dataObject.data)} --`)
          switch (dataType) {
            case `${roomId}-system-ping`:
              console.log(`> ping response to ${from}`)
              _sendBySystem(`${roomId}-system-ping-res`, from, {})
              break
            case `${roomId}-system-ping-res`:
              console.log(`> ping response from ${from}`)
              /* TODO* */
              break
          }
        }
      }
    }

    const _onMeshRoomClose = () => {
      _meshRoom = undefined
      onRoomCloseListener && onRoomCloseListener()
    }
  
    return  new Promise((resolve, reject) => {
      _meshRoom = peer.joinRoom(roomId, {mode: 'mesh'})
      _meshRoom.once('open', _onMeshRoomOpen)
      _meshRoom.once('peerJoin', _onMeshRoomPeerJoin)
      _meshRoom.once('peerLeave', _onRoomPeerLeave)
      _meshRoom.once('log', _onRoomLog)
      _meshRoom.once('stream', _onStream)
      _meshRoom.once('data', _onData)
      _meshRoom.on('close', _onMeshRoomClose)

      resolve ({
        getRoom: _getRoom,
        close: _close,
        getLog: _getLog,
        replaceStream: _replaceStream,
        send: _sendByUser
      })
    })
  }

  return {
    joinMethRoom
  }
}