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
  managerRef: React.MutableRefObject<UseManagerState>
  rootRef: React.MutableRefObject<HTMLDivElement | null>
}

export const GlobalContext = React.createContext<GlobalContextValue | undefined>(undefined)
