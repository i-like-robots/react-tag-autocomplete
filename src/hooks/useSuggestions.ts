import { useMemo } from 'react'
import type { SuggestedTag } from '../sharedTypes'

export type UseSuggestionsProps = {
  allowNew: boolean
  newTagText?: string
  suggestions: SuggestedTag[]
}

export function useSuggestions({
  allowNew,
  newTagText,
  suggestions,
}: UseSuggestionsProps): SuggestedTag[] {
  return useMemo(() => {
    const newTagOption: SuggestedTag = {
      value: null,
      label: newTagText,
      skipFilter: true,
    }

    return allowNew ? [newTagOption].concat(suggestions) : suggestions
  }, [allowNew, newTagText, suggestions])
}
