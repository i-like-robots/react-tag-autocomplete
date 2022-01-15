import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { labelId } from '../lib'

export type LabelProps = {
  children: React.ReactNode
}

export function Label({ children }: LabelProps): JSX.Element {
  const { classNames, id } = useContext(GlobalContext)

  return (
    <div className={classNames.label} id={labelId(id)}>
      {children}
    </div>
  )
}
