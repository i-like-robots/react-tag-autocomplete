import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useRoot } from '../hooks'
import type { ClassNames, OnBlur, OnFocus } from '../sharedTypes'

type RootRendererProps = React.ComponentPropsWithRef<'div'> & {
  children: React.ReactNode
  classNames: ClassNames
  isActive: boolean
  isDisabled: boolean
  isInvalid: boolean
}

export type RootRenderer = (props: RootRendererProps) => JSX.Element

const DefaultRoot: RootRenderer = ({
  children,
  classNames,
  isActive,
  isDisabled,
  isInvalid,
  ...rootProps
}) => {
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

export type RootProps = {
  children: React.ReactNode[]
  onBlur?: OnBlur
  onFocus?: OnFocus
  render?: RootRenderer
}

export function Root({ children, onBlur, onFocus, render = DefaultRoot }: RootProps): JSX.Element {
  const { classNames, isDisabled, isInvalid } = useContext(GlobalContext)
  const { isActive, rootProps } = useRoot({ onBlur, onFocus })

  return render({ children, classNames, isActive, isDisabled, isInvalid, ...rootProps })
}
