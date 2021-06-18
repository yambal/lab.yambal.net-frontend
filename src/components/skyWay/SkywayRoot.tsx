import React, { ReactNode } from 'react'
import { SkywayPeerRoot } from './providers/SkywayPeerRoot'
import { SkywayOpenedPeerRoot } from './providers/SkywayOpenedPeerRoot'


// Root
type SkywayRootProps = {
  children: ReactNode
  apiKey: string
}

export const SkywayRoot = ({apiKey, children}: SkywayRootProps ) => {
  return (
    <SkywayPeerRoot apiKey={apiKey}>
      <SkywayOpenedPeerRoot>
        {children}
      </SkywayOpenedPeerRoot>
    </SkywayPeerRoot>
  )
}