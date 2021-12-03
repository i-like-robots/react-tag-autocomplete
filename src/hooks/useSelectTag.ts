import { useCallback } from 'react'
import { findSuggestionExact } from '../lib/textMatchers'
import type { UseListManagerState } from '.'
import type { TagSelected } from '../sharedTypes'

export type UseSelectTagProps = {
  allowNew: boolean
  onAddition: (tag: TagSelected) => void
}

export type UseSelectTagState = (index?: number) => boolean

export function useSelectTag(
  manager: UseListManagerState,
  { allowNew, onAddition }: UseSelectTagProps
): UseSelectTagState {
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

  return useCallback(
    (index?: number) => {
      const tag = typeof index === 'number' ? results[index] : selectedTag

      // TODO: better detection
      if (allowNew && tag.value === null) {
        return addTag({ label: value, value: null })
      }

      if (tag) {
        return addTag({ label: tag.label, value: tag.value })
      }

      if (results.length) {
        const match = findSuggestionExact(value, results)

        if (match) {
          return addTag({ label: match.label, value: match.value })
        }
      }

      return false
    },
    [addTag, allowNew, results, selectedTag, value]
  )
}
