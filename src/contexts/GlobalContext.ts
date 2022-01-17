import React from 'react'
import type { UseListManagerState } from '../hooks'
import type { ClassNames, OnSelect } from '../sharedTypes'

export type GlobalContextValue = {
  classNames: ClassNames
  comboBoxRef: React.MutableRefObject<HTMLDivElement>
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement>
  isDisabled: boolean
  isInvalid: boolean
  listBoxRef: React.MutableRefObject<HTMLDivElement>
  listManager: UseListManagerState
  onSelect: OnSelect
  rootRef: React.MutableRefObject<HTMLDivElement>
  tagListRef: React.MutableRefObject<HTMLUListElement>
}

export const GlobalContext = React.createContext<GlobalContextValue>(null)
