import React from 'react'

export type InternalRefsContext = {
  inputRef: React.MutableRefObject<HTMLInputElement>
  comboBoxRef: React.MutableRefObject<HTMLDivElement>
  listBoxRef: React.MutableRefObject<HTMLDivElement>
  rootRef: React.MutableRefObject<HTMLDivElement>
}

export const InternalRefs = React.createContext<InternalRefsContext | null>(null)
