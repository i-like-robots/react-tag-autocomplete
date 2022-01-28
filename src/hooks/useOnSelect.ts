import { useCallback } from 'react'
import { ManagerState } from '../reducers'
import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact, findTagIndex } from '../lib'
import type { UseManagerState } from '.'
import type { OnAddition, OnDelete, Tag, OnSelect, TagSuggestion } from '../sharedTypes'

export type UseOnSelectArgs = {
  closeOnSelect: boolean
  manager: UseManagerState
  onAddition: OnAddition
  onDelete: OnDelete
}

function getNewTag(option: Tag, value: string): Tag {
  if (option?.value === CreateNewOptionValue) {
    return { label: value, value: null }
  }
}

function findSelectedTag(state: ManagerState): Tag {
  const selected: TagSuggestion =
    getNewTag(state.activeOption, state.value) ||
    state.activeOption ||
    findSuggestionExact(state.value, state.options)

  return selected?.disabled ? undefined : selected
}

export function useOnSelect({
  closeOnSelect,
  manager,
  onAddition,
  onDelete,
}: UseOnSelectArgs): OnSelect {
  return useCallback(
    (tag?: Tag) => {
      const selected = tag || findSelectedTag(manager.state)

      if (!selected) return

      const index = findTagIndex(selected, manager.state.selected)
      const result = index > -1 ? onDelete(index) : onAddition(selected)

      if (result !== false) {
        if (closeOnSelect) {
          manager.clearAll()
        } else {
          manager.clearValue()
        }
      }
    },
    [closeOnSelect, manager, onDelete, onAddition]
  )
}
