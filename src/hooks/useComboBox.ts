import { useCallback, useContext, useEffect, useState } from 'react'
import { InternalRefs } from '../contexts'
import type React from 'react'

export type UseComboBoxState = {
  collapse: () => void
  comboBoxProps: React.ComponentPropsWithRef<'div'>
  expand: () => void
  isExpanded: boolean
  isFocused: boolean
}

export function useComboBox(): UseComboBoxState {
  const { comboBoxRef, id, listManager } = useContext(InternalRefs)

  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const canExpand = Boolean(
    isFocused && listManager.state.value.length && listManager.state.results.length
  )

  useEffect(() => setIsExpanded(canExpand), [canExpand])

  const expand = useCallback(() => canExpand && setIsExpanded(true), [canExpand])

  const collapse = useCallback(() => isExpanded && setIsExpanded(false), [isExpanded])

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (comboBoxRef.current?.contains(e.relatedTarget) === false) {
        listManager.clearActiveIndex()
        setIsFocused(false)
      }
    },
    [comboBoxRef, listManager]
  )

  const onFocus = useCallback(() => setIsFocused(true), [])

  const comboBoxProps: UseComboBoxState['comboBoxProps'] = {
    id: `${id}-combobox`,
    onBlur,
    onFocus,
    ref: comboBoxRef,
  }

  return {
    collapse,
    comboBoxProps,
    expand,
    isExpanded,
    isFocused,
  }
}
