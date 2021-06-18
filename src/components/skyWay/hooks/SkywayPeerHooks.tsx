import React from 'react';
import Peer from 'skyway-js';
import { SkywayOpenedPeerContext } from '../providers/SkywayOpenedPeerRoot';
import { SkywayPeerContext } from '../providers/SkywayPeerRoot';

export const usePeer = () => {
  const [peer, setPeer] = React.useState<Peer | undefined>(undefined)
  const peerContext = React.useContext(SkywayPeerContext)

  React.useEffect(() => {
    setPeer(peerContext.peer)
  }, [peerContext.peer])

  return peer
}

export const usePeerIsOpen = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const peerContext = React.useContext(SkywayPeerContext)

  React.useEffect(() => {
    
    setIsOpen(peerContext.isOpen)
  }, [peerContext.isOpen])

  return isOpen
}

export const useOpenListener = (listener: (peerId: string) => void) => {
  const peer = usePeer()
  const isopen = usePeerIsOpen()
  const peerContext = React.useContext(SkywayPeerContext)

  React.useEffect(() => { 
    peerContext.addOpenListener(listener)
  }, [peer, isopen, peerContext.addOpenListener])
}

