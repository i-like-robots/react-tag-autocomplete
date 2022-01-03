import React from 'react'
import type { ClassNames } from '../sharedTypes'

export type ListBoxEmptyProps = React.PropsWithChildren<{ classNames: ClassNames }>

export function ListBoxEmpty({ children, classNames }: ListBoxEmptyProps): JSX.Element {
  return (
    <div className={classNames.listBoxEmpty} tabIndex={-1}>
      {children}
    </div>
  )
}
