import { useCallback } from 'react'
import { ManagerState } from '../reducers'
import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact, findTagIndex } from '../lib'
import type { UseManagerState } from '.'
import type { OnAddition, OnDelete, Tag, OnSelect, TagSuggestion, OnValidate } from '../sharedTypes'

function getNewTag(option: Tag, value: string): Tag {
  if (option?.value === CreateNewOptionValue) {
    return { label: value, value: null }
  }
}

function findSelectedTag(state: ManagerState): TagSuggestion {
  const tag =
    getNewTag(state.activeOption, state.value) ||
    state.activeOption ||
    findSuggestionExact(state.value, state.options)

  // TODO: fix types
  return tag?.['disabled'] ? null : tag
}

export type UseOnSelectArgs = {
  closeOnSelect: boolean
  manager: UseManagerState
  onAddition: OnAddition
  onDelete: OnDelete
  onValidate: OnValidate
}

export function useOnSelect({
  closeOnSelect,
  manager,
  onAddition,
  onDelete,
  onValidate,
}: UseOnSelectArgs): OnSelect {
  return useCallback(
    (tag?: Tag) => {
      tag ??= findSelectedTag(manager.state)

      if (!tag) return

      const tagIndex = findTagIndex(tag, manager.state.selected)

      if (tagIndex >= 0) {
        onDelete(tagIndex)
      } else if (onValidate ? onValidate(tag) : true) {
        onAddition(tag)

        if (closeOnSelect) {
          manager.clearAll()
        } else {
          manager.clearValue()
        }
      }
    },
    [closeOnSelect, manager, onDelete, onAddition, onValidate]
  )
}
