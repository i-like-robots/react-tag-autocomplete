import React from 'react'
import { useGlobalContext } from '../contexts'
import { useListBox } from '../hooks'

export type ListBoxProps = React.PropsWithChildren<Record<string, unknown>>

export function ListBox({ children }: ListBoxProps): JSX.Element | null {
  const { classNames, manager } = useGlobalContext()
  const listBoxProps = useListBox()

  if (!manager.state.isExpanded || React.Children.count(children) === 0) return null

  return (
    <div className={classNames.listBox} {...listBoxProps}>
      {children}
    </div>
  )
}
