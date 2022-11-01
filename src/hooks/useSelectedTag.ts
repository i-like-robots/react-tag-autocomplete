import { useCallback, useContext } from 'react'
import { VoidFn } from '../constants'
import { GlobalContext } from '../contexts'
import { replacePlaceholder } from '../lib'
import type { TagSelected } from '../sharedTypes'

export type UseSelectedTagState = {
  tag: TagSelected
  tagProps: React.ComponentPropsWithoutRef<'button'>
}

export function useSelectedTag(index: number, title: string): UseSelectedTagState {
  const { isDisabled, manager } = useContext(GlobalContext)
  const tag = manager.state.selected[index]
  const onClick = useCallback(() => manager.selectTag(tag), [manager, tag])

  return {
    tag,
    tagProps: {
      'aria-disabled': isDisabled,
      title: replacePlaceholder(title, tag.label),
      onClick: isDisabled ? VoidFn : onClick,
    },
  }
}
