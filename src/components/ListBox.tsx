import React from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import type { ClassNames } from '../sharedTypes'

export type ListBoxProps = {
  classNames: ClassNames
  children: ReactNode[]
  listBoxProps: HTMLAttributes<HTMLElement>
}

export function ListBox({ children, classNames, listBoxProps }: ListBoxProps): JSX.Element {
  return (
    <div className={classNames.suggestions} {...listBoxProps}>
      {children}
    </div>
  )
}
