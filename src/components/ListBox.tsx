import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useListBox } from '../hooks'

export type ListBoxProps = React.PropsWithChildren<Record<string, unknown>>

export function ListBox({ children }: ListBoxProps): JSX.Element {
  const { classNames, manager } = useContext(GlobalContext)
  const listBoxProps = useListBox()

  if (!manager.state.isExpanded) return null

  return (
    <div className={classNames.listBox} {...listBoxProps}>
      {children}
    </div>
  )
}
