import { useCallback, useContext, useState } from 'react'
import { GlobalContext } from '../contexts'
import { comboBoxId } from '../lib'
import type React from 'react'

export type UseComboBoxState = React.ComponentPropsWithRef<'div'>

export function useComboBox(): UseComboBoxState {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const { comboBoxRef, id, manager } = useContext(GlobalContext)

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!comboBoxRef.current?.contains(e.relatedTarget)) {
        setIsFocused(false)
        manager.collapse()
        manager.clearActiveIndex()
      }
    },
    [comboBoxRef, manager]
  )

  const onFocus = useCallback(
    (e: React.FocusEvent) => {
      if (!comboBoxRef.current?.contains(e.relatedTarget)) {
        setIsFocused(true)
        manager.expand()
      }
    },
    [comboBoxRef, manager]
  )

  const onClick = useCallback(() => {
    if (isFocused && !manager.state.isExpanded) {
      manager.expand()
    }
  }, [isFocused, manager])

  return {
    id: comboBoxId(id),
    onBlur,
    onClick,
    onFocus,
    ref: comboBoxRef,
  }
}
