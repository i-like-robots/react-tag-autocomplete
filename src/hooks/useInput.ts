import { useCallback, useContext } from 'react'
import { DisableAutoComplete, KeyNames } from '../constants'
import { ComboBoxContext, GlobalContext } from '../contexts'
import { isCaretAtEnd, isCaretAtStart } from '../lib'
import { useOnSelect } from '.'
import type React from 'react'

export type UseInputArgs = {
  allowBackspace: boolean
}

export type UseInputState = React.ComponentPropsWithRef<'input'>

export function useInput({ allowBackspace }: UseInputArgs): UseInputState {
  const { id, inputRef, isDisabled, isInvalid, listManager, onDelete } = useContext(GlobalContext)
  const { collapse, expand, isExpanded } = useContext(ComboBoxContext)

  const onSelect = useOnSelect()

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isDisabled) listManager.updateValue(e.currentTarget.value)
    },
    [isDisabled, listManager]
  )

  const onEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      onSelect()
    },
    [onSelect]
  )

  const onDownArrowKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isExpanded) {
        e.preventDefault()
        listManager.activeIndexNext()
      } else if (isCaretAtEnd(e.currentTarget)) {
        expand()
      }
    },
    [isExpanded, listManager, expand]
  )

  const onUpArrowKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isExpanded) {
        e.preventDefault()
        listManager.activeIndexPrev()
      } else if (isCaretAtStart(e.currentTarget)) {
        expand()
      }
    },
    [isExpanded, listManager, expand]
  )

  const onEscapeKey = useCallback(() => {
    if (isExpanded) {
      listManager.clearActiveIndex()
      collapse()
    }
  }, [collapse, isExpanded, listManager])

  const onBackspaceKey = useCallback(() => {
    const length = listManager.state.selectedTags.length
    const isEmpty = listManager.state.value === ''

    if (isEmpty && length && allowBackspace) onDelete(length - 1)
  }, [allowBackspace, listManager, onDelete])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === KeyNames.UpArrow) return onUpArrowKey(e)
      if (e.key === KeyNames.DownArrow) return onDownArrowKey(e)
      if (e.key === KeyNames.Enter) return onEnterKey(e)
      if (e.key === KeyNames.Escape) return onEscapeKey()
      if (e.key === KeyNames.Backspace) return onBackspaceKey()
    },
    [onBackspaceKey, onEnterKey, onEscapeKey, onDownArrowKey, onUpArrowKey]
  )

  const { activeIndex, value } = listManager.state

  return {
    ...DisableAutoComplete,
    'aria-autocomplete': 'list',
    'aria-activedescendant': isExpanded && activeIndex > -1 ? `${id}-listbox-${activeIndex}` : '',
    'aria-disabled': isDisabled,
    'aria-invalid': isInvalid,
    'aria-labelledby': `${id}-label`,
    'aria-expanded': isExpanded,
    'aria-owns': isExpanded ? `${id}-listbox` : null,
    id: `${id}-input`,
    onChange,
    onKeyDown,
    ref: inputRef,
    role: 'combobox',
    type: 'text',
    value,
  }
}
