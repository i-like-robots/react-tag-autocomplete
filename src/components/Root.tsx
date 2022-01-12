import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useManageFocus, useRoot } from '../hooks'

export type RootProps = {
  children: React.ReactNode[]
}

export function Root({ children }: RootProps): JSX.Element {
  useManageFocus()

  const { classNames, isDisabled, isInvalid } = useContext(GlobalContext)
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
