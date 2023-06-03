import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useListBox } from '../hooks'
import { OptionProps } from './Option'

export type ListBoxProps = {
  children: React.ReactElement<OptionProps>[]
}

export function ListBox({ children }: ListBoxProps): JSX.Element | null {
  const { classNames, managerRef } = useContext(GlobalContext)
  const listBoxProps = useListBox()

  if (!managerRef.current.state.isExpanded || React.Children.count(children) === 0) return null

  return (
    <div className={classNames.listBox} {...listBoxProps}>
      {children}
    </div>
  )
}
