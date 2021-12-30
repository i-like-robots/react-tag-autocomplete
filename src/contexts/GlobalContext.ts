import React from 'react'
import type { UseListManagerState } from '../hooks'
import type { TagSelected } from '../sharedTypes'

export type GlobalContextValue = {
  comboBoxRef: React.MutableRefObject<HTMLDivElement>
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement>
  isDisabled: boolean
  isInvalid: boolean
  listBoxRef: React.MutableRefObject<HTMLDivElement>
  listManager: UseListManagerState
  // TODO
  onAddition: (tag: TagSelected) => boolean
  onDelete: (index: number) => boolean
  rootRef: React.MutableRefObject<HTMLDivElement>
  tagListRef: React.MutableRefObject<HTMLUListElement>
}

export const GlobalContext = React.createContext<GlobalContextValue | null>(null)
