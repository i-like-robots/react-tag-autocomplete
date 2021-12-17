import { useCallback } from 'react'
import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact, tagToKey } from '../lib'
import type { UseListManagerState } from '.'
import type { TagSelected, TagSuggestion } from '../sharedTypes'

export type UseOnSelectState = (tag?: TagSuggestion) => void

export function useOnSelect(
  manager: UseListManagerState,
  onAddition: (tag: TagSelected) => boolean
): UseOnSelectState {
  const { activeTag, results, selectedKeys, value } = manager.state

  const addTag = useCallback(
    (tag: TagSelected) => onAddition(tag) && manager.clearAll(),
    [manager, onAddition]
  )

  return useCallback(() => {
    if (activeTag?.value === CreateNewOptionValue) {
      return addTag({ label: value, value: null })
    }

    if (
      activeTag &&
      activeTag?.disabled !== true &&
      selectedKeys.has(tagToKey(activeTag)) !== true
    ) {
      return addTag({ label: activeTag.label, value: activeTag.value })
    }

    if (value && results.length) {
      const match = findSuggestionExact(value, results)

      if (match) {
        addTag({ label: match.label, value: match.value })
      }
    }
  }, [activeTag, addTag, results, selectedKeys, value])
}
