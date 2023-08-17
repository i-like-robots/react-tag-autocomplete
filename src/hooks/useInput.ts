import type React from 'react'
import { useContext, useMemo } from 'react'
import { KeyNames, VoidFn } from '../constants'
import { GlobalContext } from '../contexts'
import { inputId, isCaretAtEnd, isCaretAtStart, labelId, listBoxId, optionId } from '../lib'

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
  const { id, comboBoxRef, inputRef, isDisabled, isInvalid, managerRef } = useContext(GlobalContext)

  const events = useMemo(() => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      managerRef.current.updateInputValue(value)

      if (document.activeElement === inputRef.current) {
        managerRef.current.listBoxExpand(value)
      }
    }

    const onFocus = () => {
      managerRef.current.listBoxExpand()
    }

    const onBlur = (e: React.FocusEvent) => {
      if (comboBoxRef.current?.contains(e.relatedTarget) === false) {
        managerRef.current.listBoxCollapse()
      }
    }

    const onClick = () => {
      managerRef.current.listBoxExpand()
    }

    const onDownArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { activeIndex, isExpanded } = managerRef.current.state

      if (isExpanded) {
        e.preventDefault()
        managerRef.current.updateActiveIndex(activeIndex + 1)
      } else if (isCaretAtEnd(e.currentTarget) || e.altKey) {
        e.preventDefault()
        managerRef.current.listBoxExpand()
      }
    }

    const onUpArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { activeIndex, isExpanded } = managerRef.current.state

      if (isExpanded) {
        e.preventDefault()
        managerRef.current.updateActiveIndex(activeIndex - 1)
      } else if (isCaretAtStart(e.currentTarget)) {
        e.preventDefault()
        managerRef.current.listBoxExpand()
      }
    }

    const onPageDownKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { isExpanded, options } = managerRef.current.state

      if (isExpanded) {
        e.preventDefault()
        managerRef.current.updateActiveIndex(options.length - 1)
      }
    }

    const onPageUpKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (managerRef.current.state.isExpanded) {
        e.preventDefault()
        managerRef.current.updateActiveIndex(0)
      }
    }

    const onEscapeKey = () => {
      if (managerRef.current.state.isExpanded) {
        managerRef.current.listBoxCollapse()
      } else {
        managerRef.current.updateInputValue('')
      }
    }

    const onBackspaceKey = () => {
      if (allowBackspace) {
        const { value, selected } = managerRef.current.state
        const lastTag = selected[selected.length - 1]

        if (value === '' && lastTag) {
          managerRef.current.selectTag(lastTag)
        }
      }
    }

    const onDelimiterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (managerRef.current.state.isExpanded) {
        e.preventDefault()
        managerRef.current.selectTag()
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
  }, [allowBackspace, comboBoxRef, delimiterKeys, inputRef, managerRef])

  const { activeOption, isExpanded, value } = managerRef.current.state

  return {
    ...DisableAutoCompleteAttrs,
    'aria-autocomplete': 'list',
    'aria-activedescendant': activeOption ? optionId(id, activeOption) : undefined,
    'aria-controls': listBoxId(id),
    'aria-describedby': ariaDescribedBy || undefined,
    'aria-disabled': isDisabled,
    'aria-errormessage': (isInvalid && ariaErrorMessage) || undefined,
    'aria-invalid': isInvalid,
    'aria-labelledby': labelId(id),
    'aria-expanded': isExpanded,
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
