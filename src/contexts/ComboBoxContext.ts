import React from 'react'

export type ComboBoxContextState = {
  collapse: () => void
  expand: () => void
  isExpanded: boolean
  // isFocused: boolean
}

export const ComboBoxContext = React.createContext<ComboBoxContextState | null>(null)
