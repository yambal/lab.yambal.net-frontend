import React from 'react';
import { useEffect } from 'react';
import { useListAllPeers, useOpenedPeer, useOpenListener } from './hooks';

export const SkywayContainer = () => {
  const peer = useOpenedPeer()
  const allPeers = useListAllPeers()
  useOpenListener((peerId :string) => {
    console.log(peerId)
  })

  return (
    <>
      <div>{peer && peer.id}</div>
        <div>All Peers : {allPeers.join(', ')}</div>
    </>
    
  )
}