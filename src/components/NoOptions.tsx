import React from 'react'
import type { ClassNames } from '../sharedTypes'

export type NoOptionsProps = React.PropsWithChildren<{ classNames: ClassNames }>

export function NoOptions({ children, classNames }: NoOptionsProps): JSX.Element {
  return (
    <div className={classNames.noOptions} tabIndex={-1}>
      {children}
    </div>
  )
}
