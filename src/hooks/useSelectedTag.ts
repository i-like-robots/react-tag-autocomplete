import { useCallback, useContext } from 'react'
import { VoidFn } from '../constants'
import { GlobalContext } from '../contexts'
import type { TagSelected } from '../sharedTypes'

export type UseSelectedTagState = TagSelected & {
  tagProps: React.ComponentPropsWithoutRef<'button'>
}

export function useSelectedTag(index: number, title: string): UseSelectedTagState {
  const { isDisabled, manager, onSelect } = useContext(GlobalContext)
  const tag = manager.state.selectedTags[index]
  const onClick = useCallback(() => onSelect(tag), [onSelect, tag])

  return {
    ...tag,
    tagProps: {
      'aria-disabled': isDisabled,
      title: title.replace('%label%', tag.label),
      onClick: isDisabled ? VoidFn : onClick,
    },
  }
}
