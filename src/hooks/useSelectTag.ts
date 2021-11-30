import { useCallback } from 'react'
import { findSuggestionExact } from '../lib/textMatchers'
import type { UseListManagerState } from '.'
import type { TagSelected } from '../sharedTypes'

export type UseSelectTagProps = {
  allowNew: boolean
  onAddition: (tag: TagSelected) => void
}

export type UseSelectTagState = () => boolean

export function useSelectTag(
  manager: UseListManagerState,
  { allowNew, onAddition }: UseSelectTagProps
): UseSelectTagState {
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
    if (allowNew && manager.selectedIndex === 0) {
      return addTag({ label: manager.value, value: null })
    }

    if (manager.selectedTag) {
      return addTag({ label: manager.selectedTag.label, value: manager.selectedTag.value })
    }

    if (manager.results.length) {
      const match = findSuggestionExact(manager.value, manager.results)

      if (match) {
        return addTag({ label: match.label, value: match.value })
      }
    }

    return false
  }, [addTag, allowNew, manager])
}
