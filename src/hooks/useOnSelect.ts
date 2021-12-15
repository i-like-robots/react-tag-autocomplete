import { useCallback } from 'react'
import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact } from '../lib/textMatchers'
import type { UseListManagerState } from '.'
import type { TagSelected, TagSuggestion } from '../sharedTypes'

export type UseOnSelectState = (tag?: TagSuggestion) => void

export function useOnSelect(
  manager: UseListManagerState,
  onAddition: (tag: TagSelected) => boolean
): UseOnSelectState {
  const { results, selectedTag, value } = manager.state

  const addTag = useCallback(
    (tag: TagSelected) => onAddition(tag) && manager.clearAll(),
    [manager, onAddition]
  )

  return useCallback(() => {
    if (selectedTag?.value === CreateNewOptionValue) {
      return addTag({ label: value, value: null })
    }

    if (selectedTag && selectedTag?.disabled !== true) {
      return addTag({ label: selectedTag.label, value: selectedTag.value })
    }

    if (value && results.length) {
      const match = findSuggestionExact(value, results)

      if (match) {
        addTag({ label: match.label, value: match.value })
      }
    }
  }, [addTag, results, selectedTag, value])
}
