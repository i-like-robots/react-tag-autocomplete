import React from 'react'
import { useRootActive } from '../hooks'
import type { ClassNames } from '../sharedTypes'

export type RootProps = {
  ariaLabelText: string
  children: React.ReactNode[]
  classNames: ClassNames
}

export function Root({ children, classNames }: RootProps): JSX.Element {
  const { isActive, rootProps } = useRootActive()

  const classes = [classNames.root]

  if (isActive) classes.push(classNames.rootActive)

  return (
    <div className={classes.join(' ')} {...rootProps}>
      {children}
    </div>
  )
}
