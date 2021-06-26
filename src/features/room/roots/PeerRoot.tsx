import React, { ReactNode } from 'react';
import { SystemProps, x } from '@xstyled/styled-components'
import { PeerInitializer } from '../initializer/PeerInitializer'
import { RecoilRoot } from 'recoil'

type PeerRootProps = SystemProps & {
  apiKey: string
  children: ReactNode
}

export const PeerRoot: React.FC<PeerRootProps> = React.forwardRef(function Button(
  {
    apiKey,
    children,
    ...restProps
  },
  ref
) {
  return (
    <RecoilRoot>
      <x.div
        ref={ref}
        {...restProps}
      >
        <PeerInitializer apiKey={apiKey} />
        {children}
      </x.div>
    </RecoilRoot>
  )
})
