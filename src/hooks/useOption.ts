import { useCallback, useContext, useEffect, useRef } from 'react'
import { GlobalContext } from '../contexts'
import { optionId, tagToKey } from '../lib'
import type React from 'react'
import type { TagOption } from '../sharedTypes'

export type UseOptionState = { optionProps: React.ComponentPropsWithRef<'div'> } & TagOption

export function useOption(index: number): UseOptionState {
  const optionRef = useRef<HTMLDivElement>()
  const { id, inputRef, listManager, onSelect } = useContext(GlobalContext)
  const { options, selectedKeys, activeIndex } = listManager.state
  const option = options[index]
  const active = index === activeIndex
  const disabled = option.disabled ?? false
  const selected = selectedKeys.includes(tagToKey(option))

  const onClick = useCallback(() => {
    onSelect()
    inputRef.current?.focus()
  }, [inputRef, onSelect])

  const onMouseDown = useCallback(() => {
    if (index !== activeIndex) listManager.updateActiveIndex(index)
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
      id: optionId(id, index),
      onClick,
      onMouseDown,
      ref: optionRef,
      role: 'option',
      tabIndex: -1,
    },
  }
}
