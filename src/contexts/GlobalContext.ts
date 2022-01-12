import React from 'react'
import type { UseListManagerState } from '../hooks'
import type { OnAddition, OnDelete } from '../sharedTypes'

export type GlobalContextValue = {
  comboBoxRef: React.MutableRefObject<HTMLDivElement>
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement>
  isDisabled: boolean
  isInvalid: boolean
  listBoxRef: React.MutableRefObject<HTMLDivElement>
  listManager: UseListManagerState
  onAddition: OnAddition
  onDelete: OnDelete
  rootRef: React.MutableRefObject<HTMLDivElement>
  tagListRef: React.MutableRefObject<HTMLUListElement>
}

export const GlobalContext = React.createContext<GlobalContextValue>(null)
