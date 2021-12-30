import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useManageFocus, useRoot } from '../hooks'
import type { ClassNames } from '../sharedTypes'

export type RootProps = {
  children: React.ReactNode[]
  classNames: ClassNames
}

export function Root({ children, classNames }: RootProps): JSX.Element {
  useManageFocus()

  const { isDisabled, isInvalid } = useContext(GlobalContext)
  const { isActive, rootProps } = useRoot()

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
