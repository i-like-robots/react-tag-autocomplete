import React from 'react'
import type { UseManagerState } from '../hooks'
import type { ClassNames } from '../sharedTypes'

export type GlobalContextValue = {
  classNames: ClassNames
  comboBoxRef: React.MutableRefObject<HTMLDivElement | null>
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  isDisabled: boolean
  isInvalid: boolean
  listBoxRef: React.MutableRefObject<HTMLDivElement | null>
  manager: UseManagerState
  rootRef: React.MutableRefObject<HTMLDivElement | null>
  tagListRef: React.MutableRefObject<HTMLUListElement | null>
}

export const GlobalContext = React.createContext<GlobalContextValue | undefined>(undefined)
