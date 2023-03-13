import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useRoot } from '../hooks'
import type { OnBlur, OnFocus } from '../sharedTypes'

export type RootProps = {
  children: React.ReactNode[]
  onBlur?: OnBlur
  onFocus?: OnFocus
}

export function Root({ children, onBlur, onFocus }: RootProps): JSX.Element {
  const { classNames, isDisabled, isInvalid } = useContext(GlobalContext)
  const { isActive, rootProps } = useRoot({ onBlur, onFocus })

  const classes = [classNames.root]

  if (isActive) classes.push(classNames.rootIsActive)
  if (isDisabled) classes.push(classNames.rootIsDisabled)
  if (isInvalid) classes.push(classNames.rootIsInvalid)

  return (
    <div className={classes.join(' ')} {...rootProps}>
      {children}
    </div>
  )
}
