import React, { ReactNode } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useMount } from 'react-use'
import Peer, { DataConnection, MediaConnection } from 'skyway-js'

// Contect
type tSkywayContext = {
  peer: Peer | undefined
  isOpen: boolean,
  addOpenListener: (listener: (peerId: string) => void) => void | undefined
}

const init: tSkywayContext = {
  peer: undefined,
  isOpen: false,
  addOpenListener: undefined
}

export const SkywayPeerContext = React.createContext(init)

// SkywayPeerRoot
type ProviderProps = {
  children: ReactNode
  apiKey: string
}

export const SkywayPeerRoot = ({children, apiKey}:ProviderProps) => {
  const [peer, setPeer] = React.useState<Peer | undefined>(undefined)
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [openListener, setOpenListener] = React.useState<(peerId: string) => void | undefined>(undefined)

  const addOpenListener = useCallback((listener: (peerId: string) => void) => {
    setOpenListener(listener)
  },[openListener])

  const onOpen = useCallback((peerId: string) => {
    console.log(`peer open: ${peerId}`)
    setIsOpen(true)
  },[peer, isOpen, openListener])

  useEffect(() => {
    console.log(`${peer} ${isOpen} ${openListener}`)
    if(peer && isOpen && openListener) {
      console.log(45)
      openListener(peer.id)
    }
  },[peer, isOpen, openListener])

  useMount(() => {
    const _peer = new Peer({
      key: apiKey,
      debug: 2,
    })

    // シグナリングサーバへ正常に接続できたときのイベントです。
    _peer.on('open', onOpen)

    // 接続先の Peer からメディアチャネル(音声・映像)の接続を受信したときのイベントです。
    _peer.on("call", (call: MediaConnection) => {
      console.log(`peer call: ${call.id}`)
      _peer.listAllPeers((peer) => {
        console.log(peer)
      })
    });

    // peer.destroy()を実行したときに発生するイベントです。 
    _peer.on('close', () => {
      console.log(`peer close`)
      setIsOpen(false)
      _peer.listAllPeers((peer) => {
        console.log(peer)
      })
    })

    // 接続先の Peer から DataChannel の接続を受信したときのイベントです。
    _peer.on("connection", (conn: DataConnection) => {
      console.log(`peer connection: ${conn.id}`)
      _peer.listAllPeers((peer) => {
        console.log(peer)
      })
    });

    // エラーが発生した場合のイベントです。
    _peer.on("error", (error: Error) => {
      console.log(error);
      _peer.listAllPeers((peer) => {
        console.log(peer)
      })
    });

    setPeer(_peer)
  })

  return (
    <SkywayPeerContext.Provider value={{
      peer,
      isOpen,
      addOpenListener
    }}>
      {children}
    </SkywayPeerContext.Provider>
  )
}
