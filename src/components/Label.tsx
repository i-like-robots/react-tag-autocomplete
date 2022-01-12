import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'

export type LabelProps = {
  children: React.ReactNode
}

export function Label({ children }: LabelProps): JSX.Element {
  const { classNames, id } = useContext(GlobalContext)

  return (
    <div className={classNames.label} id={`${id}-label`}>
      {children}
    </div>
  )
}
