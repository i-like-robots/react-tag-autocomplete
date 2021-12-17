import React, { useContext } from 'react'
import { InternalRefs } from '../contexts'

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
}

export function Label({ ariaLabelText }: LabelProps): JSX.Element {
  const { id } = useContext(InternalRefs)

  return (
    <span id={`${id}-label`} style={LabelStyles}>
      {ariaLabelText}
    </span>
  )
}
