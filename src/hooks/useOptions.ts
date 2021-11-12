import type { HTMLAttributes } from 'react'
import type { SuggestedTag } from '../sharedTypes'
import type { UseListManagerState } from './useListManager'

export type UseOptionsProps = {
  id: string
  onAddition: (tag: SuggestedTag) => void
}

export type UseOptionsState = Array<
  SuggestedTag & {
    index: number
    isDisabled: boolean
    isSelected: boolean
    optionProps: HTMLAttributes<HTMLElement>
  }
>

export function useOptions(
  manager: UseListManagerState,
  { id, onAddition }: UseOptionsProps
): UseOptionsState {
  return manager.results.map((result, index) => {
    const isDisabled = false
    const isSelected = index === manager.selectedIndex

    const optionProps: HTMLAttributes<HTMLElement> = {
      'aria-disabled': false,
      'aria-posinset': index + 1,
      'aria-selected': isSelected ? 'true' : 'false',
      'aria-setsize': manager.results.length,
      id: `${id}-listbox-${index}`,
      role: 'option',
      onClick: () => onAddition(result),
    }

    return {
      index,
      isDisabled,
      isSelected,
      optionProps,
      ...result,
    }
  })
}
