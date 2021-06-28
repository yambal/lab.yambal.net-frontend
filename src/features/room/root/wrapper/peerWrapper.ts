import { useCallback } from "react"
import Peer, { PeerConstructorOption } from "skyway-js"
import { LogLevel } from "ts-loader/dist/logger"

export const peerOpener = (apiKey: string, peerId?:string, debug?: LogLevel):Promise<{peer: Peer, peerId: string}> => {
  return new Promise((resolve, reject) => {
    const peer = new Peer(peerId, {key: apiKey, debug: debug || 0})
    peer.once('open', (peerId) => {
      resolve({peer, peerId})
    })
  })
}

type PeerWrapperOption = {
  peerId?: string
  debug?: LogLevel
  peerOnClose?: () => void
}

type PeerMethods = {
  destroy: () => void
}

export const peerWrapper = (apiKey: string, option?: PeerWrapperOption):Promise<{peer: Peer, peerId: string}> => {
  return new Promise((resolve, reject) => {
    peerOpener(apiKey, option?.peerId, option?.debug).then(({peer, peerId})=> {
      option?.peerOnClose && peer.on('close', option.peerOnClose)
      resolve({peer, peerId })
    })
  })
}