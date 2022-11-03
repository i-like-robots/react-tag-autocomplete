import React, { useRef } from 'react'
import type { PublicAPI, Tag } from '../sharedTypes'
import type { UseManagerState } from './useManagerTwo'

export type UsePublicAPIArgs = {
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  manager: UseManagerState
}

export function usePublicAPI({ inputRef, manager }: UsePublicAPIArgs): PublicAPI {
  const api = useRef<PublicAPI>({
    input: {
      blur() {
        inputRef.current?.blur()
      },
      focus() {
        inputRef.current?.focus()
      },
      get value() {
        return manager.state.value
      },
      set value(value: string) {
        manager.updateInputValue(value)
      },
    },
    listBox: {
      collapse() {
        manager.listBoxCollapse()
      },
      expand() {
        manager.listBoxExpand()
      },
      get activeOption() {
        return manager.state.activeOption
      },
      get isExpanded() {
        return manager.state.isExpanded
      },
    },
    select(tag?: Tag) {
      manager.selectTag(tag)
    },
  })

  return api.current
}
