import React from 'react'
import type { UseListManagerState } from '../hooks'

export type InternalRefsContext = {
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement>
  comboBoxRef: React.MutableRefObject<HTMLDivElement>
  listBoxRef: React.MutableRefObject<HTMLDivElement>
  listManager: UseListManagerState
  onSelect: () => boolean
  rootRef: React.MutableRefObject<HTMLDivElement>
}

export const InternalRefs = React.createContext<InternalRefsContext | null>(null)
