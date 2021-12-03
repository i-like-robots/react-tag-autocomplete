import React from 'react'
import type { TagOption } from '../sharedTypes'
import type { UseListManagerState } from './useListManager'

export type UseOptionsProps = {
  id: string
  selectTag: (index?: number) => boolean
}

export type UseOptionsState = Array<{ optionProps: React.HTMLAttributes<HTMLElement> } & TagOption>

export function useOptions(
  manager: UseListManagerState,
  { id, selectTag }: UseOptionsProps
): UseOptionsState {
  const { results, selectedIndex, value: inputValue } = manager.state

  return results.map((result, index) => {
    const disabled = result.disabled ?? false
    const focused = index === selectedIndex
    const selected = index === selectedIndex
    // const selected = result.selected ?? false

    const args = { disabled, focused, index, inputValue, selected }
    const label = result.transformLabel?.(args) || result.label
    const value = result.transformValue?.(args) || result.value

    const optionProps: React.HTMLAttributes<HTMLElement> = {
      'aria-disabled': disabled,
      'aria-posinset': index + 1,
      'aria-selected': selected,
      'aria-setsize': results.length,
      id: `${id}-listbox-${index}`,
      role: 'option',
      tabIndex: -1,
      onMouseDown() {
        manager.setSelectedIndex(index)
      },
      onClick() {
        selectTag(index)
      },
    }

    return {
      index,
      disabled,
      focused,
      selected,
      label,
      optionProps,
      value,
    }
  })
}
