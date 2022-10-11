import { useCallback } from 'react'
import { ManagerState } from '../reducers'
import { NewOptionValue } from '../constants'
import { findSuggestionExact, findTagIndex } from '../lib'
import type { UseManagerState } from '.'
import type { OnAdd, OnDelete, Tag, OnSelect, TagSuggestion } from '../sharedTypes'

function getNewTag<T extends Tag>(
  option: TagSuggestion<T> | null,
  value: string
): TagSuggestion<T> | undefined {
  if (option?.value === NewOptionValue && option.disabled === false) {
    return { value: value, label: value } as TagSuggestion<T> // FIXME
  }
}

function findSelectedTag<T extends Tag>(state: ManagerState<T>): TagSuggestion<T> | undefined {
  const tag =
    getNewTag(state.activeOption, state.value) ||
    state.activeOption ||
    findSuggestionExact(state.value, state.options)

  return tag && !tag.disabled ? tag : undefined
}

export type UseOnSelectArgs<T extends Tag> = {
  closeOnSelect: boolean
  manager: UseManagerState<T>
  onAdd: OnAdd<T>
  onDelete: OnDelete
}

export function useOnSelect<T extends Tag>({
  closeOnSelect,
  manager,
  onAdd,
  onDelete,
}: UseOnSelectArgs<T>): OnSelect<T> {
  return useCallback(
    (tag?: T) => {
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
