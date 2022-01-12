import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'

export type NoOptionsProps = {
  children: React.ReactNode
}

export function NoOptions({ children }: NoOptionsProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)

  return (
    <div className={classNames.noOptions} tabIndex={-1}>
      {children}
    </div>
  )
}
