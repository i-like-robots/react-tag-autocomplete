import { useCallback, useEffect, useState } from 'react'
import { KeyNames } from '../constants'
import { isCaretAtEnd, isCaretAtStart } from '../lib/cursor'

import type React from 'react'
import type { UseListManagerState } from '.'

export type UseListBoxProps = {
  comboBoxRef: React.MutableRefObject<HTMLDivElement>
  id: string
  inputRef: React.MutableRefObject<HTMLInputElement>
  listBoxRef: React.MutableRefObject<HTMLDivElement>
  selectTag: () => boolean
}

export type UseListBoxState = {
  comboBoxProps: React.ComponentPropsWithRef<'div'>
  inputProps: React.ComponentPropsWithRef<'input'>
  isExpanded: boolean
  isFocused: boolean
  listBoxProps: React.ComponentPropsWithRef<'div'>
}

export function useComboBox(
  manager: UseListManagerState,
  { comboBoxRef, id, inputRef, listBoxRef, selectTag }: UseListBoxProps
): UseListBoxState {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const { results, selectedIndex, value } = manager.state

  const canExpand = isFocused && value.length > 0 && results.length > 0

  useEffect(() => setIsExpanded(canExpand), [canExpand])

  const onBlur = useCallback(
    (e: React.FocusEvent) => {
      if (!comboBoxRef.current?.contains(e.relatedTarget)) {
        manager.clearSelectedIndex()
        setIsFocused(false)
      }
    },
    [comboBoxRef, manager]
  )

  const onFocus = useCallback(() => setIsFocused(true), [])

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => manager.updateValue(e.currentTarget.value),
    [manager]
  )

  const onEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      selectTag()
    },
    [selectTag]
  )

  const onDownArrowKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isExpanded) {
        e.preventDefault()
        manager.selectedIndexNext()
      } else if (canExpand && isCaretAtEnd(e.currentTarget)) {
        setIsExpanded(true)
      }
    },
    [canExpand, isExpanded, manager]
  )

  const onUpArrowKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isExpanded) {
        e.preventDefault()
        manager.selectedIndexPrev()
      } else if (canExpand && isCaretAtStart(e.currentTarget)) {
        setIsExpanded(true)
      }
    },
    [canExpand, isExpanded, manager]
  )

  const onEscapeKey = useCallback(() => {
    if (isExpanded) {
      manager.clearSelectedIndex()
      setIsExpanded(false)
    }
  }, [isExpanded, manager])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === KeyNames.UpArrow) {
        return onUpArrowKey(e)
      }

      if (e.key === KeyNames.DownArrow) {
        return onDownArrowKey(e)
      }

      if (e.key === KeyNames.Enter) {
        return onEnterKey(e)
      }

      if (e.key === KeyNames.Escape) {
        return onEscapeKey()
      }
    },
    [onEnterKey, onEscapeKey, onDownArrowKey, onUpArrowKey]
  )

  const comboBoxProps: UseListBoxState['comboBoxProps'] = {
    onBlur,
    onFocus,
    ref: comboBoxRef,
  }

  const inputProps: UseListBoxState['inputProps'] = {
    'aria-autocomplete': 'list',
    'aria-activedescendant': isExpanded ? `${id}-listbox-${selectedIndex}` : '',
    'aria-owns': isExpanded ? `${id}-listbox` : '',
    'aria-expanded': isExpanded ? 'true' : 'false',
    autoComplete: 'false',
    id: `${id}-input`,
    onChange,
    onKeyDown,
    ref: inputRef,
    role: 'combobox',
    type: 'text',
    value,
  }

  const listBoxProps: UseListBoxState['listBoxProps'] = {
    id: `${id}-listbox`,
    role: 'listbox',
    ref: listBoxRef,
  }

  return {
    comboBoxProps,
    inputProps,
    isExpanded,
    isFocused,
    listBoxProps,
  }
}
