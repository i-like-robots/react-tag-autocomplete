import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact, tagToKey } from '../lib'
import type { UseListManagerState } from '.'
import type { OnAddition, OnDelete, Tag, TagSuggestion, OnSelect } from '../sharedTypes'
import { useCallback } from 'react'

const getNewTag = (option: TagSuggestion, value: string): Tag => {
  if (option?.value === CreateNewOptionValue) {
    return { label: value, value: null }
  }
}

export type UseOnSelectArgs = {
  listManager: UseListManagerState
  onAddition: OnAddition
  onDelete: OnDelete
}

export function useOnSelect({ listManager, onAddition, onDelete }: UseOnSelectArgs): OnSelect {
  const selectTag = useCallback(
    (tag: TagSuggestion) => {
      if (tag.disabled) return

      const index = listManager.state.selectedKeys.indexOf(tagToKey(tag))
      const result = index > -1 ? onDelete(index) : onAddition(tag)

      if (result) listManager.clearValue()
    },
    [listManager, onAddition, onDelete]
  )

  return useCallback(
    (tag?: TagSuggestion) => {
      const { activeOption, options, value } = listManager.state

      if (tag) return selectTag(tag)

      if (activeOption) {
        const newTag = getNewTag(activeOption, value)
        return selectTag(newTag || activeOption)
      }

      const exactTag = findSuggestionExact(value, options)

      if (exactTag) return selectTag(exactTag)
    },
    [listManager, selectTag]
  )
}
