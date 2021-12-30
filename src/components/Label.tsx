import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import type { ClassNames } from '../sharedTypes'

const LabelStyles: React.CSSProperties = {
  position: 'absolute',
  left: -10000,
  top: 'auto',
  width: 1,
  height: 1,
  overflow: 'hidden',
}

export type LabelProps = {
  ariaLabelText: string
  classNames: ClassNames
}

export function Label({ ariaLabelText, classNames }: LabelProps): JSX.Element {
  const { id } = useContext(GlobalContext)

  return (
    <span className={classNames.label} id={`${id}-label`} style={LabelStyles}>
      {ariaLabelText}
    </span>
  )
}
