import Peer, { MeshRoom } from 'skyway-js'

type PeerOption = {
  key: string
  onPeerOpenListener?: (peerId) => void
  onPeerCloseListener? : () => void
}

export type PeerMethods = {
  getPeer: () => Peer
  destroy: () => void
}

export const peerWrapper = () => {
  let _peer: Peer| undefined = undefined
  let _isPeerOpened: boolean = false

  // Methods
  const getPeer = () => {
    return _peer
  }

  const destroy = () => {
    _peer.destroy()
  }

  // 
  const newPeer = ({
    key,
    onPeerOpenListener,
    onPeerCloseListener
  }:PeerOption):Promise<PeerMethods> => {

    // Listeners
    const _onPeerOpen = (peerId) => {
      _isPeerOpened = true
      onPeerOpenListener && onPeerOpenListener(peerId)
    }

    const _onPeerClose = () => {
      _isPeerOpened = false
      _peer = undefined
      onPeerCloseListener && onPeerCloseListener()
    }

    return new Promise((resolve, reject) => {
      _peer = new Peer({key, debug: 3})
      _peer.on('open', _onPeerOpen)
      _peer.on('close', _onPeerClose)
      
      resolve({
        getPeer,
        destroy
      })
    })
  }

  return {
    newPeer
  }
}
