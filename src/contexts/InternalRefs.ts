import React from 'react'
import type { UseListManagerState } from '../hooks'

export type InternalRefsContext = {
  comboBoxRef: React.MutableRefObject<HTMLDivElement>
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement>
  isDisabled: boolean
  listBoxRef: React.MutableRefObject<HTMLDivElement>
  listManager: UseListManagerState
  onSelect: () => void
  rootRef: React.MutableRefObject<HTMLDivElement>
  tagListRef: React.MutableRefObject<HTMLUListElement>
}

export const InternalRefs = React.createContext<InternalRefsContext | null>(null)
