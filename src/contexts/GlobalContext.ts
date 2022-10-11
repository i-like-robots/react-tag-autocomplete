import React from 'react'
import type { UseManagerState } from '../hooks'
import type { ClassNames, OnInput, OnSelect, Tag } from '../sharedTypes'

export type GlobalContextValue<T extends Tag> = {
  classNames: ClassNames
  comboBoxRef: React.MutableRefObject<HTMLDivElement | null>
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  isDisabled: boolean
  isInvalid: boolean
  listBoxRef: React.MutableRefObject<HTMLDivElement | null>
  manager: UseManagerState<T>
  onInput?: OnInput
  onSelect: OnSelect<T>
  rootRef: React.MutableRefObject<HTMLDivElement | null>
  tagListRef: React.MutableRefObject<HTMLUListElement | null>
}

// FIXME, should be GlobalContextValue<T>
export const GlobalContext = React.createContext<GlobalContextValue<Tag> | undefined>(undefined)

export function useGlobalContext<T extends Tag>() {
  const context = React.useContext(GlobalContext as React.Context<GlobalContextValue<T>>)

  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider')
  }

  return context
}
