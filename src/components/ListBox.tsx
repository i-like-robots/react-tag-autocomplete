import React from 'react'
import type { ClassNames } from '../sharedTypes'

export type ListBoxProps = React.PropsWithChildren<{
  classNames: ClassNames
  listBoxProps: React.ComponentPropsWithRef<'div'>
}>

export function ListBox({ children, classNames, listBoxProps }: ListBoxProps): JSX.Element {
  return (
    <div className={classNames.suggestions} {...listBoxProps}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return child
        }
      })}
    </div>
  )
}
