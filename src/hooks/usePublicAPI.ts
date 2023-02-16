import React, { useRef } from 'react'
import type { PublicAPI, Tag } from '../sharedTypes'
import type { UseManagerState } from './useManager'

export type UsePublicAPIArgs = {
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  managerRef: React.MutableRefObject<UseManagerState>
}

export function usePublicAPI({ inputRef, managerRef }: UsePublicAPIArgs): PublicAPI {
  const api = useRef<PublicAPI>({
    input: {
      blur() {
        inputRef.current?.blur()
      },
      focus() {
        inputRef.current?.focus()
      },
      get value() {
        return managerRef.current.state.value
      },
      set value(value: string) {
        if (typeof value !== 'string') {
          value = String(value)
        }

        managerRef.current.updateInputValue(value)
      },
    },
    listBox: {
      collapse() {
        managerRef.current.listBoxCollapse()
      },
      expand() {
        managerRef.current.listBoxExpand()
      },
      get activeOption() {
        return managerRef.current.state.activeOption
      },
      get isExpanded() {
        return managerRef.current.state.isExpanded
      },
    },
    select(tag?: Tag) {
      managerRef.current.selectTag(tag)
    },
  })

  return api.current
}
