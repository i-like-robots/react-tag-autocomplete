import { useRef } from 'react'
import type { PublicAPI } from '../sharedTypes'
import type { UseManagerState } from '.'

export function usePublicAPI(manager: UseManagerState) {
  const api = useRef<PublicAPI>({
    input: {
      clearValue() {
        manager.clearValue()
      },
      getValue() {
        return manager.state.value
      },
      setValue(value: string) {
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
      isExpanded() {
        return manager.state.isExpanded
      },
    },
  })

  return api.current
}
