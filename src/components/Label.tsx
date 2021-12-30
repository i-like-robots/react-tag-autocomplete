import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import type { ClassNames } from '../sharedTypes'

export type LabelProps = {
  ariaLabelText: string
  classNames: ClassNames
}

export function Label({ ariaLabelText, classNames }: LabelProps): JSX.Element {
  const { id } = useContext(GlobalContext)

  return (
    <div className={classNames.label} id={`${id}-label`}>
      {ariaLabelText}
    </div>
  )
}
