import { useCallback } from 'react'
import { ManagerState } from '../reducers'
import { NewOptionValue } from '../constants'
import { findSuggestionExact, findTagIndex } from '../lib'
import type { UseManagerState } from '.'
import type { OnAdd, OnDelete, Tag, OnSelect, TagSuggestion } from '../sharedTypes'

function getNewTag(option: TagSuggestion | null, value: string): TagSuggestion | undefined {
  if (option?.value === NewOptionValue && option.disabled === false) {
    return { value: value, label: value }
  }
}

function findSelectedTag(state: ManagerState): TagSuggestion | undefined {
  const tag =
    getNewTag(state.activeOption, state.value) ||
    state.activeOption ||
    findSuggestionExact(state.value, state.options)

  return tag && !tag.disabled ? tag : undefined
}

export type UseOnSelectArgs = {
  closeOnSelect: boolean
  manager: UseManagerState
  onAdd: OnAdd
  onDelete: OnDelete
}

export function useOnSelect({
  closeOnSelect,
  manager,
  onAdd,
  onDelete,
}: UseOnSelectArgs): OnSelect {
  return useCallback(
    (tag?: Tag) => {
      tag ??= findSelectedTag(manager.state)

      if (!tag) return

      const tagIndex = findTagIndex(tag, manager.state.selected)

      if (tagIndex >= 0) {
        onDelete(tagIndex)
      } else {
        onAdd(tag)

        if (closeOnSelect) {
          manager.clearAll()
        } else {
          manager.clearValue()
        }
      }
    },
    [closeOnSelect, manager, onDelete, onAdd]
  )
}
