import { useMemo } from 'react'
import { KeyNames, VoidFn } from '../constants'
import { useGlobalContext } from '../contexts'
import { inputId, isCaretAtEnd, isCaretAtStart, labelId, listBoxId, optionId } from '../lib'
import type React from 'react'

export type UseInputArgs = {
  allowBackspace: boolean
  allowTab: boolean
  ariaDescribedBy?: string
  ariaErrorMessage?: string
}

export type UseInputState = Omit<React.ComponentPropsWithRef<'input'>, 'value'> & { value: string }

// <https://stackoverflow.com/questions/59939931/stop-dashlane-auto-fill-on-specific-input-fields>
const DisableAutoCompleteAttrs = {
  autoComplete: 'off',
  autoCorrect: 'off',
  'data-form-type': 'other',
  spellCheck: false,
}

export function useInput({
  allowBackspace,
  allowTab,
  ariaDescribedBy,
  ariaErrorMessage,
}: UseInputArgs): UseInputState {
  const { id, inputRef, isDisabled, isInvalid, manager, onInput, onSelect } = useGlobalContext()

  const events = useMemo(() => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      manager.updateValue(value)
      onInput?.(value)
    }

    const onDownArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.updateActiveIndex(manager.state.activeIndex + 1)
      } else if (isCaretAtEnd(e.currentTarget)) {
        manager.expand()
      }
    }

    const onUpArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.updateActiveIndex(manager.state.activeIndex - 1)
      } else if (isCaretAtStart(e.currentTarget)) {
        manager.expand()
      }
    }

    const onPageDownKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.updateActiveIndex(manager.state.options.length - 1)
      }
    }

    const onPageUpKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.updateActiveIndex(0)
      }
    }

    const onEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        onSelect()
      }
    }

    const onEscapeKey = () => {
      if (manager.state.isExpanded) {
        manager.clearActiveIndex()
        manager.collapse()
      } else {
        manager.clearValue()
      }
    }

    const onBackspaceKey = () => {
      if (allowBackspace) {
        const isEmpty = manager.state.value === ''
        const lastTag = manager.state.selected[manager.state.selected.length - 1]

        if (isEmpty && lastTag) {
          onSelect(lastTag)
        }
      }
    }

    const onTabKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (allowTab && manager.state.isExpanded) {
        e.preventDefault()
        onSelect()
      }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === KeyNames.UpArrow) return onUpArrowKey(e)
      if (e.key === KeyNames.DownArrow) return onDownArrowKey(e)
      if (e.key === KeyNames.PageUp) return onPageUpKey(e)
      if (e.key === KeyNames.PageDown) return onPageDownKey(e)
      if (e.key === KeyNames.Enter) return onEnterKey(e)
      if (e.key === KeyNames.Escape) return onEscapeKey()
      if (e.key === KeyNames.Backspace) return onBackspaceKey()
      if (e.key === KeyNames.Tab) return onTabKey(e)
    }

    return { onChange, onKeyDown }
  }, [allowBackspace, allowTab, manager, onInput, onSelect])

  const { activeOption, isExpanded, value } = manager.state

  return {
    ...DisableAutoCompleteAttrs,
    'aria-autocomplete': 'list',
    'aria-activedescendant': activeOption ? optionId(id, activeOption) : undefined,
    'aria-describedby': ariaDescribedBy || undefined,
    'aria-disabled': isDisabled,
    'aria-errormessage': (isInvalid && ariaErrorMessage) || undefined,
    'aria-invalid': isInvalid,
    'aria-labelledby': labelId(id),
    'aria-expanded': isExpanded,
    'aria-owns': listBoxId(id),
    id: inputId(id),
    onChange: isDisabled ? VoidFn : events.onChange,
    onKeyDown: isDisabled ? VoidFn : events.onKeyDown,
    ref: inputRef,
    role: 'combobox',
    type: 'text',
    value,
  }
}
