import { useCallback } from 'react'
import { VoidFn } from '../constants'
import { useGlobalContext } from '../contexts'
import { replacePlaceholder } from '../lib'
import type { Tag, TagSelected } from '../sharedTypes'

export type UseSelectedTagState<T extends Tag> = {
  tag: TagSelected<T>
  tagProps: React.ComponentPropsWithoutRef<'button'>
}

export function useSelectedTag<T extends Tag>(
  index: number,
  title: string
): UseSelectedTagState<T> {
  const { isDisabled, manager, onSelect } = useGlobalContext<T>()
  const tag = manager.state.selected[index]
  const onClick = useCallback(() => onSelect(tag), [onSelect, tag])

  return {
    tag,
    tagProps: {
      'aria-disabled': isDisabled,
      title: replacePlaceholder(title, tag.label),
      onClick: isDisabled ? VoidFn : onClick,
    },
  }
}
