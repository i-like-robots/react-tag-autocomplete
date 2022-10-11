import React, { useRef } from 'react'
import type { PublicAPI, Tag } from '../sharedTypes'
import type { UseManagerState } from '.'

export type UsePublicAPIArgs<T extends Tag> = {
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  manager: UseManagerState<T>
}

export function usePublicAPI<T extends Tag>({
  inputRef,
  manager,
}: UsePublicAPIArgs<T>): PublicAPI<T> {
  const api = useRef<PublicAPI<T>>({
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
