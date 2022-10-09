import React, { useRef } from 'react'
import type { PublicAPI } from '../sharedTypes'
import type { UseManagerState } from '.'

export type UsePublicAPIArgs = {
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  manager: UseManagerState
}

export function usePublicAPI({ inputRef, manager }: UsePublicAPIArgs): PublicAPI {
  const api = useRef<PublicAPI>({
    input: {
      clear() {
        manager.clearValue()
      },
      focus() {
        inputRef.current?.focus()
      },
      get value() {
        return manager.state.value
      },
      set value(value: string) {
        manager.updateValue(value)
      },
    },
    listBox: {
      collapse() {
        manager.collapse()
      },
      expand() {
        manager.expand()
      },
      get activeIndex() {
        return manager.state.activeIndex
      },
      set activeIndex(index: number) {
        manager.updateActiveIndex(index)
      },
      get isExpanded() {
        return manager.state.isExpanded
      },
      get options() {
        return manager.state.options
      },
    },
  })

  return api.current
}
