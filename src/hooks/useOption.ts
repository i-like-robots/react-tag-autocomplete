import { useCallback, useContext, useEffect, useRef } from 'react'
import { GlobalContext } from '../contexts'
import { findTagIndex, optionId } from '../lib'
import type React from 'react'
import type { TagOption } from '../sharedTypes'

export type UseOptionState = { optionProps: React.ComponentPropsWithRef<'div'> } & TagOption

export function useOption(index: number): UseOptionState {
  const { id, inputRef, manager, onSelect } = useContext(GlobalContext)
  const optionRef = useRef<HTMLDivElement>()
  const option = manager.state.options[index]
  const active = index === manager.state.activeIndex
  const disabled = option.disabled ?? false
  const selected = findTagIndex(option, manager.state.selected) > -1

  const onClick = useCallback(() => {
    onSelect()
    inputRef.current?.focus()
  }, [inputRef, onSelect])

  const onMouseDown = useCallback(() => {
    if (index !== manager.state.activeIndex) {
      manager.updateActiveIndex(index)
    }
  }, [index, manager])

  useEffect(() => {
    if (active) {
      optionRef.current?.scrollIntoView({ block: 'nearest', inline: 'start' })
    }
  }, [active])

  return {
    ...option,
    active,
    disabled,
    index,
    selected,
    optionProps: {
      'aria-disabled': disabled,
      'aria-posinset': index + 1,
      'aria-selected': disabled ? undefined : selected,
      'aria-setsize': manager.state.options.length,
      id: optionId(id, option),
      onClick,
      onMouseDown,
      ref: optionRef,
      role: 'option',
      tabIndex: -1,
    },
  }
}
