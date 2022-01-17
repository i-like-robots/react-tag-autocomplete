import { useCallback, useContext } from 'react'
import { DisableAutoComplete, KeyNames } from '../constants'
import { ComboBoxContext, GlobalContext } from '../contexts'
import { inputId, isCaretAtEnd, isCaretAtStart, labelId, listBoxId, optionId } from '../lib'
import type React from 'react'

const NO_OP = () => undefined

export type UseInputArgs = {
  allowBackspace: boolean
}

export type UseInputState = React.ComponentPropsWithRef<'input'>

export function useInput({ allowBackspace }: UseInputArgs): UseInputState {
  const { id, inputRef, isDisabled, isInvalid, listManager, onSelect } = useContext(GlobalContext)
  const { collapse, expand, isExpanded } = useContext(ComboBoxContext)

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      listManager.updateValue(e.currentTarget.value)
    },
    [listManager]
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
        listManager.updateActiveIndex(listManager.state.activeIndex + 1)
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
        listManager.updateActiveIndex(listManager.state.activeIndex - 1)
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
    const isEmpty = listManager.state.value === ''
    const lastTag = listManager.state.selectedTags[listManager.state.selectedTags.length - 1]

    if (allowBackspace && isEmpty && lastTag) onSelect(lastTag)
  }, [allowBackspace, listManager, onSelect])

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
    'aria-activedescendant': isExpanded && activeIndex > -1 ? optionId(id, activeIndex) : '',
    'aria-disabled': isDisabled,
    'aria-invalid': isInvalid,
    'aria-labelledby': labelId(id),
    'aria-expanded': isExpanded,
    'aria-owns': isExpanded ? listBoxId(id) : null,
    id: inputId(id),
    onChange: isDisabled ? NO_OP : onChange,
    onKeyDown: isDisabled ? NO_OP : onKeyDown,
    ref: inputRef,
    role: 'combobox',
    type: 'text',
    value,
  }
}
