import { useCallback, useContext, useState } from 'react'
import { GlobalContext } from '../contexts'
import { comboBoxId } from '../lib'
import type React from 'react'

type ComboBoxAPI = {
  collapse: () => void
  expand: () => void
}

type ComboBoxState = {
  isExpanded: boolean
  isFocused: boolean
}

export type UseComboBoxState = ComboBoxState &
  ComboBoxAPI & {
    comboBoxProps: React.ComponentPropsWithRef<'div'>
  }

export function useComboBox(): UseComboBoxState {
  const { comboBoxRef, id, manager } = useContext(GlobalContext)
  const [state, setState] = useState<ComboBoxState>({ isExpanded: false, isFocused: false })

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!comboBoxRef.current?.contains(e.relatedTarget)) {
        setState({ isExpanded: false, isFocused: false })
        manager.clearActiveIndex()
      }
    },
    [comboBoxRef, manager]
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
