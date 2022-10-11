import { useMemo } from 'react'
import { useGlobalContext } from '../contexts'
import { comboBoxId } from '../lib'
import type React from 'react'

export type UseComboBoxState = React.ComponentPropsWithRef<'div'>

export function useComboBox(): UseComboBoxState {
  const { comboBoxRef, id, manager } = useGlobalContext()

  return useMemo(() => {
    return {
      id: comboBoxId(id),
      ref: comboBoxRef,
      onBlur(e: React.FocusEvent) {
        if (!comboBoxRef.current?.contains(e.relatedTarget)) {
          manager.collapse()
          manager.clearActiveIndex()
        }
      },
      onFocus(e: React.FocusEvent) {
        if (!comboBoxRef.current?.contains(e.relatedTarget)) {
          manager.expand()
        }
      },
      onClick() {
        if (!manager.state.isExpanded) {
          manager.expand()
        }
      },
    }
  }, [comboBoxRef, id, manager])
}
