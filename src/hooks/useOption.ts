import React, { useCallback, useContext, useLayoutEffect, useRef } from 'react'
import { GlobalContext } from '../contexts'
import { tagToKey } from '../lib'
import type { TagOption, TagSuggestion } from '../sharedTypes'

export type UseOptionState = { optionProps: React.ComponentPropsWithRef<'div'> } & TagOption

export function useOption(tag: TagSuggestion): UseOptionState {
  const optionRef = useRef<HTMLDivElement>()
  const { id, inputRef, listManager, onSelect } = useContext(GlobalContext)
  const { results, selectedKeys, activeIndex } = listManager.state

  const index = results.indexOf(tag)
  const active = index === activeIndex
  const disabled = tag.disabled ?? false
  const selected = selectedKeys.includes(tagToKey(tag))

  const onClick = useCallback(() => {
    onSelect()
    inputRef.current?.focus()
  }, [inputRef, onSelect])

  const onMouseDown = useCallback(() => {
    activeIndex !== index && listManager.setActiveIndex(index)
  }, [index, listManager, activeIndex])

  useLayoutEffect(() => {
    active && optionRef.current?.scrollIntoView({ block: 'nearest', inline: 'start' })
  }, [active, results.length])

  return {
    ...tag,
    active,
    disabled,
    index,
    selected,
    optionProps: {
      'aria-disabled': disabled,
      'aria-posinset': index + 1,
      'aria-selected': disabled ? null : selected,
      'aria-setsize': results.length,
      id: `${id}-listbox-${index}`,
      onClick,
      onMouseDown,
      ref: optionRef,
      role: 'option',
      tabIndex: -1,
    },
  }
}
