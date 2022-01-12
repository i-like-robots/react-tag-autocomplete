import React, { useContext } from 'react'
import { ComboBoxContext, GlobalContext } from '../contexts'
import { useListBox } from '../hooks'

export type ListBoxProps = React.PropsWithChildren<Record<string, unknown>>

export function ListBox({ children }: ListBoxProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { isExpanded } = useContext(ComboBoxContext)
  const listBoxProps = useListBox()

  if (!isExpanded) return null

  return (
    <div className={classNames.listBox} {...listBoxProps}>
      {children}
    </div>
  )
}
