import React, { useContext } from 'react'
import { InternalRefs } from '../contexts'
import { useManageFocus, useRootActive } from '../hooks'
import type { ClassNames } from '../sharedTypes'

export type RootProps = {
  children: React.ReactNode[]
  classNames: ClassNames
}

export function Root({ children, classNames }: RootProps): JSX.Element {
  useManageFocus()

  const { isDisabled } = useContext(InternalRefs)
  const { isActive, rootProps } = useRootActive()

  const classes = [classNames.root]

  if (isActive) classes.push(classNames.rootActive)
  if (isDisabled) classes.push(classNames.rootDisabled)

  return (
    <div className={classes.join(' ')} {...rootProps}>
      {children}
    </div>
  )
}
