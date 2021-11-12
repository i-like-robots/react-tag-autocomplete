import React from 'react'
import type { HTMLAttributes } from 'react'
import type { ClassNames } from '../sharedTypes'

export type ListBoxProps = {
  classNames: ClassNames
  children: JSX.Element[]
  listBoxProps: HTMLAttributes<HTMLElement>
}

export function ListBox({ classNames, listBoxProps, children }: ListBoxProps): JSX.Element {
  return (
    <div className={classNames.suggestions} {...listBoxProps}>
      {children}
    </div>
  )
}
