import { useCallback } from 'react'
import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact, findTagIndex } from '../lib'
import type { UseManagerState } from '.'
import type { OnAddition, OnDelete, Tag, TagSuggestion, OnSelect } from '../sharedTypes'

const getNewTag = (option: TagSuggestion, value: string): Tag => {
  if (option?.value === CreateNewOptionValue) {
    return { label: value, value: null }
  }
}

export type UseOnSelectArgs = {
  closeOnSelect: boolean
  manager: UseManagerState
  onAddition: OnAddition
  onDelete: OnDelete
}

export function useOnSelect({
  closeOnSelect,
  manager,
  onAddition,
  onDelete,
}: UseOnSelectArgs): OnSelect {
  const selectTag = useCallback(
    (tag: TagSuggestion) => {
      if (tag.disabled) return

      const index = findTagIndex(tag, manager.state.selected)
      const result = index > -1 ? onDelete(index) : onAddition(tag)

      if (result) manager.clearValue()
      if (closeOnSelect) manager.collapse()
    },
    [closeOnSelect, manager, onAddition, onDelete]
  )

  return useCallback(
    (tag?: TagSuggestion) => {
      const { activeOption, options, value } = manager.state

      if (tag) return selectTag(tag)

      if (activeOption) {
        const newTag = getNewTag(activeOption, value)
        return selectTag(newTag || activeOption)
      }

      const exactTag = findSuggestionExact(value, options)
      if (exactTag) return selectTag(exactTag)
    },
    [manager, selectTag]
  )
}
