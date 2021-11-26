import React from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import type { ClassNames } from '../sharedTypes'

export type ListBoxProps = {
  classNames: ClassNames
  children: ReactNode[]
  listBoxProps: HTMLAttributes<HTMLElement>
}

export function ListBox({ classNames, listBoxProps, children }: ListBoxProps): JSX.Element {
  return (
    <div className={classNames.suggestions} {...listBoxProps}>
      {children}
    </div>
  )
}
