import { useCallback, useEffect, useState } from 'react'
import { KeyNames } from '../constants'
import { isCaretAtEnd, isCaretAtStart } from '../lib/cursor'

import type React from 'react'
import type { UseListManagerState } from './'

export type UseListBoxProps = {
  createNewTag: () => boolean
  id: string
  selectMatchingTag: () => boolean
  selectTag: () => boolean
}

export type UseListBoxState = {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
  isExpanded: boolean
  isFocused: boolean
  listBoxProps: React.HTMLAttributes<HTMLElement>
}

export function useListBox(
  manager: UseListManagerState,
  { createNewTag, id, selectMatchingTag, selectTag }: UseListBoxProps
): UseListBoxState {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const canExpand = isFocused && manager.value.length > 0 && manager.results.length > 0

  useEffect(() => setIsExpanded(canExpand), [canExpand])

  const onBlur = useCallback(() => {
    manager.clearSelectedIndex()
    setIsFocused(false)
  }, [manager])

  const onFocus = useCallback(() => setIsFocused(true), [])

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => manager.updateValue(e.currentTarget.value),
    [manager]
  )

  const onEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      selectTag() || selectMatchingTag() || createNewTag()
    },
    [createNewTag, selectMatchingTag, selectTag]
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

  const inputProps: UseListBoxState['inputProps'] = {
    'aria-autocomplete': 'list',
    'aria-activedescendant': isExpanded ? `${id}-listbox-${manager.selectedIndex}` : '',
    'aria-owns': isExpanded ? `${id}-listbox` : '',
    'aria-expanded': isExpanded ? 'true' : 'false',
    autoComplete: 'false',
    id: `${id}-input`,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    role: 'combobox',
    type: 'text',
    value: manager.value,
  }

  const listBoxProps: UseListBoxState['listBoxProps'] = {
    id: `${id}-listbox`,
    role: 'listbox',
  }

  return {
    inputProps,
    isExpanded,
    isFocused,
    listBoxProps,
  }
}
