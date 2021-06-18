import React, { ReactNode } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useMount } from 'react-use'
import Peer from 'skyway-js'
import { useOpenedPeer } from '../hooks/SkywayOpenedPeer'

// Contect
type tSkywayOpenedPeerContext = {
  openedPeer: Peer | undefined
  listAllPeers: () => void
}

const init: tSkywayOpenedPeerContext = {
  openedPeer: undefined,
  listAllPeers: () => {}
}

export const SkywayOpenedPeerContext = React.createContext(init)

// SkywayPeerRoot
type ProviderProps = {
  children: ReactNode,
}

export const SkywayOpenedPeerRoot = ({children}:ProviderProps) => {
  const [openedPeer, setOpenedPeer] = React.useState<Peer | undefined>(undefined)
  const [listAllPeers, setListAllPeers] = React.useState<() => void>(() => {})
  const _openedPeer = useOpenedPeer()

  const listAllPeersImp = useCallback(() => {
    if(_openedPeer) {
      _openedPeer.listAllPeers((peer) => {
        console.log(peer)
      })
    }else {

    }
  },[_openedPeer])

  useEffect(() => {
    if(_openedPeer) {
      setOpenedPeer(_openedPeer)
      setListAllPeers(listAllPeersImp)
    } else {
      setOpenedPeer(undefined)
      setListAllPeers(() => {})
    }
  },[_openedPeer])

  return (
    <SkywayOpenedPeerContext.Provider value={{
      openedPeer: openedPeer,
      listAllPeers
    }}>
      {children}
    </SkywayOpenedPeerContext.Provider>
  )
}



