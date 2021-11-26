import { useCallback } from 'react'
import { findSuggestionExact } from '../lib/textMatchers'

import type { UseListManagerState } from '.'
import type { SuggestedTag } from '../sharedTypes'

export type UseTagActionsProps = {
  allowNew: boolean
  onAddition: (tag: SuggestedTag) => void
  onValidate?: (value: string) => boolean
}

export type UseTagActionsState = {
  createNewTag: () => boolean
  selectMatchingTag: () => boolean
  selectTag: () => boolean
}

export function useTagActions(
  manager: UseListManagerState,
  { allowNew, onAddition, onValidate }: UseTagActionsProps
): UseTagActionsState {
  const addTag = useCallback(
    (tag: SuggestedTag) => {
      // TODO: refactor onAddition to return a boolean
      onAddition(tag)
      manager.clearAll()
      return true
    },
    [manager, onAddition]
  )

  const createNewTag = useCallback(() => {
    const isValid = allowNew ? onValidate?.(manager.value) || true : false
    return isValid ? addTag({ label: manager.value, value: null }) : false
  }, [addTag, allowNew, manager.value, onValidate])

  const selectMatchingTag = useCallback(() => {
    if (manager.results.length) {
      const match = findSuggestionExact(manager.value, manager.results)
      return match ? addTag(match) : false
    }
  }, [addTag, manager.results, manager.value])

  const selectTag = useCallback(() => {
    return manager.selectedTag ? addTag(manager.selectedTag) : false
  }, [addTag, manager.selectedTag])

  return { createNewTag, selectMatchingTag, selectTag }
}
