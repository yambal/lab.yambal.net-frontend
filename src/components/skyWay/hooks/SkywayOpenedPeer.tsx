import React from 'react';
import Peer from 'skyway-js';
import { SkywayPeerContext } from '../providers/SkywayPeerRoot';

export const useOpenedPeer = () => {
  const peerContext = React.useContext(SkywayPeerContext)
  const [openedPeer, setOpenedPeer] = React.useState<Peer | undefined>(undefined)

  React.useEffect(() => {
    if(peerContext.isOpen && peerContext.peer) {
      setOpenedPeer(peerContext.peer)
    } else {
      setOpenedPeer(undefined)
    }
  },[peerContext.isOpen, peerContext.peer])

  return openedPeer
}

export const useListAllPeers = () => {
  const peer = useOpenedPeer()
  const [listAllPeers, setListAllPeers] = React.useState<string[]>([])

  React.useEffect(() => {
    if(peer){
      peer.listAllPeers((peers) => {
        setListAllPeers(peers)
      })
    }
  },[peer])

  return listAllPeers
}

