import { useCallback, useContext, useState } from 'react'
import { GlobalContext } from '../contexts'
import type React from 'react'
import { comboBoxId } from '../lib'

type ComboBoxInternalState = {
  isExpanded: boolean
  isFocused: boolean
}

export type UseComboBoxState = ComboBoxInternalState & {
  collapse: () => void
  comboBoxProps: React.ComponentPropsWithRef<'div'>
  expand: () => void
}

export function useComboBox(): UseComboBoxState {
  const { comboBoxRef, id, listManager } = useContext(GlobalContext)
  const [state, setState] = useState<ComboBoxInternalState>({ isExpanded: false, isFocused: false })

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!comboBoxRef.current?.contains(e.relatedTarget)) {
        setState({ isExpanded: false, isFocused: false })
        listManager.clearActiveIndex()
      }
    },
    [comboBoxRef, listManager]
  )

  const onFocus = useCallback(() => setState({ isExpanded: true, isFocused: true }), [])

  const expand = useCallback(() => setState({ ...state, isExpanded: true }), [state])

  const collapse = useCallback(() => setState({ ...state, isExpanded: false }), [state])

  const comboBoxProps: UseComboBoxState['comboBoxProps'] = {
    id: comboBoxId(id),
    onBlur,
    onFocus,
    ref: comboBoxRef,
  }

  return {
    ...state,
    collapse,
    comboBoxProps,
    expand,
  }
}
