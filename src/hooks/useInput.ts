import { useContext, useMemo } from 'react'
import { KeyNames, VoidFn } from '../constants'
import { GlobalContext } from '../contexts'
import { inputId, isCaretAtEnd, isCaretAtStart, labelId, listBoxId, optionId } from '../lib'
import type React from 'react'

export type UseInputArgs = {
  allowBackspace: boolean
  ariaDescribedBy?: string
  ariaErrorMessage?: string
  delimiterKeys: string[]
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
  ariaDescribedBy,
  ariaErrorMessage,
  delimiterKeys,
}: UseInputArgs): UseInputState {
  const { id, comboBoxRef, inputRef, isDisabled, isInvalid, manager } = useContext(GlobalContext)

  const events = useMemo(() => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      manager.updateInputValue(value)

      if (document.activeElement === inputRef.current) {
        manager.listBoxExpand()
      }
    }

    const onFocus = () => {
      manager.listBoxExpand()
    }

    const onBlur = (e: React.FocusEvent) => {
      if (comboBoxRef.current?.contains(e.relatedTarget)) {
        inputRef.current.focus()
      } else {
        manager.listBoxCollapse()
      }
    }

    const onClick = () => {
      manager.listBoxExpand()
    }

    const onDownArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.updateActiveIndex(manager.state.activeIndex + 1)
      } else if (isCaretAtEnd(e.currentTarget) || e.altKey) {
        e.preventDefault()
        manager.listBoxExpand()
      }
    }

    const onUpArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.updateActiveIndex(manager.state.activeIndex - 1)
      } else if (isCaretAtStart(e.currentTarget)) {
        e.preventDefault()
        manager.listBoxExpand()
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

    const onEscapeKey = () => {
      if (manager.state.isExpanded) {
        manager.listBoxCollapse()
      } else {
        manager.updateInputValue('')
      }
    }

    const onBackspaceKey = () => {
      if (allowBackspace) {
        const isEmpty = manager.state.value === ''
        const lastTag = manager.state.selected[manager.state.selected.length - 1]

        if (isEmpty && lastTag) {
          manager.selectTag(lastTag)
        }
      }
    }

    const onDelimiterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (manager.state.isExpanded) {
        e.preventDefault()
        manager.selectTag()
      }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === KeyNames.UpArrow) return onUpArrowKey(e)
      if (e.key === KeyNames.DownArrow) return onDownArrowKey(e)
      if (e.key === KeyNames.PageUp) return onPageUpKey(e)
      if (e.key === KeyNames.PageDown) return onPageDownKey(e)
      if (e.key === KeyNames.Escape) return onEscapeKey()
      if (e.key === KeyNames.Backspace) return onBackspaceKey()
      if (delimiterKeys.includes(e.key)) return onDelimiterKey(e)
    }

    return { onBlur, onChange, onClick, onFocus, onKeyDown }
  }, [allowBackspace, comboBoxRef, delimiterKeys, inputRef, manager])

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
    onBlur: isDisabled ? VoidFn : events.onBlur,
    onChange: isDisabled ? VoidFn : events.onChange,
    onClick: isDisabled ? VoidFn : events.onClick,
    onFocus: isDisabled ? VoidFn : events.onFocus,
    onKeyDown: isDisabled ? VoidFn : events.onKeyDown,
    ref: inputRef,
    role: 'combobox',
    type: 'text',
    value,
  }
}
