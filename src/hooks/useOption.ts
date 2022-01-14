import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { GlobalContext } from '../contexts'
import { tagToKey } from '../lib'
import { useOnSelect } from '.'
import type { TagOption } from '../sharedTypes'

export type UseOptionState = { optionProps: React.ComponentPropsWithRef<'div'> } & TagOption

export function useOption(index: number): UseOptionState {
  const optionRef = useRef<HTMLDivElement>()
  const { id, inputRef, listManager } = useContext(GlobalContext)
  const onSelect = useOnSelect()
  const option = listManager.state.options[index]

  const { options, selectedKeys, activeIndex } = listManager.state
  const active = index === activeIndex
  const disabled = option.disabled ?? false
  const selected = selectedKeys.includes(tagToKey(option))

  const onClick = useCallback(() => {
    onSelect()
    inputRef.current?.focus()
  }, [inputRef, onSelect])

  const onMouseDown = useCallback(() => {
    activeIndex !== index && listManager.updateActiveIndex(index)
  }, [index, listManager, activeIndex])

  useEffect(() => {
    active && optionRef.current?.scrollIntoView({ block: 'nearest', inline: 'start' })
  }, [active, options.length])

  return {
    ...option,
    active,
    disabled,
    index,
    selected,
    optionProps: {
      'aria-disabled': disabled,
      'aria-posinset': index + 1,
      'aria-selected': disabled ? null : selected,
      'aria-setsize': options.length,
      id: `${id}-listbox-${index}`,
      onClick,
      onMouseDown,
      ref: optionRef,
      role: 'option',
      tabIndex: -1,
    },
  }
}
