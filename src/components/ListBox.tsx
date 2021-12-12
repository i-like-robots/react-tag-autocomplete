import React, { useContext } from 'react'
import { ComboBoxContext } from '../contexts'
import { useListBox } from '../hooks'
import type { ClassNames } from '../sharedTypes'

export type ListBoxProps = React.PropsWithChildren<{ classNames: ClassNames }>

export function ListBox({ children, classNames }: ListBoxProps): JSX.Element {
  const { isExpanded } = useContext(ComboBoxContext)
  const listBoxProps = useListBox()

  return isExpanded ? (
    <div className={classNames.suggestions} {...listBoxProps}>
      {children}
    </div>
  ) : null
}
