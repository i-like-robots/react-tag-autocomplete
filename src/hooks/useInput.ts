import { useCallback, useContext } from 'react'
import { DisableAutoComplete, KeyNames, VoidFn } from '../constants'
import { GlobalContext } from '../contexts'
import { inputId, isCaretAtEnd, isCaretAtStart, labelId, listBoxId, optionId } from '../lib'
import type React from 'react'

export type UseInputArgs = {
  allowBackspace: boolean
}

export type UseInputState = React.ComponentPropsWithRef<'input'>

export function useInput({ allowBackspace }: UseInputArgs): UseInputState {
  const { id, inputRef, isDisabled, isInvalid, manager, onInput, onSelect } =
    useContext(GlobalContext)

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      manager.updateValue(value)
      onInput?.(value)
    },
    [manager, onInput]
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
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.updateActiveIndex(manager.state.activeIndex + 1)
      } else if (isCaretAtEnd(e.currentTarget)) {
        manager.expand()
      }
    },
    [manager]
  )

  const onUpArrowKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.updateActiveIndex(manager.state.activeIndex - 1)
      } else if (isCaretAtStart(e.currentTarget)) {
        manager.expand()
      }
    },
    [manager]
  )

  const onEscapeKey = useCallback(() => {
    if (manager.state.isExpanded) {
      manager.clearActiveIndex()
      manager.collapse()
    }
  }, [manager])

  const onBackspaceKey = useCallback(() => {
    const isEmpty = manager.state.value === ''
    const lastTag = manager.state.selected[manager.state.selected.length - 1]

    if (allowBackspace && isEmpty && lastTag) onSelect(lastTag)
  }, [allowBackspace, manager, onSelect])

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

  const { activeIndex, isExpanded, value } = manager.state

  return {
    ...DisableAutoComplete,
    'aria-autocomplete': 'list',
    'aria-activedescendant': isExpanded && activeIndex > -1 ? optionId(id, activeIndex) : '',
    'aria-disabled': isDisabled,
    'aria-invalid': isInvalid,
    'aria-labelledby': labelId(id),
    'aria-expanded': isExpanded,
    'aria-owns': isExpanded ? listBoxId(id) : null,
    id: inputId(id),
    onChange: isDisabled ? VoidFn : onChange,
    onKeyDown: isDisabled ? VoidFn : onKeyDown,
    ref: inputRef,
    role: 'combobox',
    type: 'text',
    value,
  }
}
