import { useCallback, useContext } from 'react'
import { GlobalContext } from '../contexts'
import { TagSelected } from '../sharedTypes'

export type UseSelectedTagState = {
  tag: TagSelected
  tagProps: React.ComponentPropsWithoutRef<'button'>
}

export function useSelectedTag(index: number, title: string): UseSelectedTagState {
  const { isDisabled, listManager, onDelete } = useContext(GlobalContext)
  const onClick = useCallback(() => onDelete(index), [index, onDelete])
  const tag = listManager.state.selectedTags[index]

  return {
    tag,
    tagProps: {
      'aria-disabled': isDisabled,
      title: title.replace('%label%', tag.label),
      onClick: isDisabled ? null : onClick,
    },
  }
}
