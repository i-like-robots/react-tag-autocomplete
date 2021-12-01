import React from 'react'
import type { ClassNames } from '../sharedTypes'

export type ListBoxProps = {
  classNames: ClassNames
  children: React.ReactNode[]
  listBoxProps: React.ComponentPropsWithRef<'div'>
}

export function ListBox({ children, classNames, listBoxProps }: ListBoxProps): JSX.Element {
  return (
    <div className={classNames.suggestions} {...listBoxProps}>
      {children}
    </div>
  )
}
