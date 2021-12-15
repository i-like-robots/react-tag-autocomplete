import { useCallback } from 'react'
import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact } from '../lib/textMatchers'
import type { UseListManagerState } from '.'
import type { TagSelected, TagSuggestion } from '../sharedTypes'

export type UseOnSelectState = (tag?: TagSuggestion) => boolean

export function useOnSelect(
  manager: UseListManagerState,
  onAddition: (tag: TagSelected) => void
): UseOnSelectState {
  const { results, selectedTag, value } = manager.state

  const addTag = useCallback(
    (tag: TagSelected) => {
      // TODO: refactor onAddition to return a boolean
      onAddition(tag)
      manager.clearAll()
      return true
    },
    [manager, onAddition]
  )

  return useCallback(() => {
    if (selectedTag) {
      if (selectedTag.value === CreateNewOptionValue) {
        return addTag({ label: value, value: null })
      }

      if (!selectedTag.disabled && !selectedTag.selected) {
        return addTag({ label: selectedTag.label, value: selectedTag.value })
      }

      return false
    }

    if (results.length) {
      const match = findSuggestionExact(value, results)

      if (match) {
        return addTag({ label: match.label, value: match.value })
      }
    }

    return false
  }, [addTag, results, selectedTag, value])
}
