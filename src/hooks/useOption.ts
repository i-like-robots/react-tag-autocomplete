import React, { useCallback, useContext, useLayoutEffect, useRef } from 'react'
import { InternalRefs } from '../contexts'
import type { TagOption, TagSuggestion } from '../sharedTypes'

export type UseOptionState = { optionProps: React.ComponentPropsWithRef<'div'> } & TagOption

export function useOption(tag: TagSuggestion): UseOptionState {
  const optionRef = useRef<HTMLDivElement>()
  const { id, listManager, onSelect } = useContext(InternalRefs)
  const { results, selectedIndex } = listManager.state

  const index = results.indexOf(tag)
  const active = index === selectedIndex
  const disabled = tag.disabled ?? false
  const selected = tag.selected ?? false

  const onClick = useCallback(() => onSelect(), [onSelect])

  const onMouseDown = useCallback(() => {
    selectedIndex !== index && listManager.setSelectedIndex(index)
  }, [index, listManager, selectedIndex])

  useLayoutEffect(() => {
    active && optionRef.current?.scrollIntoView({ block: 'nearest', inline: 'start' })
  }, [active])

  return {
    ...tag,
    active,
    disabled,
    index,
    selected,
    optionProps: {
      'aria-disabled': disabled,
      'aria-posinset': index + 1,
      'aria-selected': selected,
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
