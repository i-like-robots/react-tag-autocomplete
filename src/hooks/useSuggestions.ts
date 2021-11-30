import { useMemo } from 'react'
import type { TagSuggestion } from '../sharedTypes'

export type UseSuggestionsProps = {
  allowNew: boolean
  newTagText?: string
  suggestions: TagSuggestion[]
}

export function useSuggestions({
  allowNew,
  newTagText,
  suggestions,
}: UseSuggestionsProps): TagSuggestion[] {
  return useMemo(() => {
    const newTagOption: TagSuggestion = {
      label: '',
      skipFilter: true,
      transformLabel: (args) => newTagText.replace('%value%', args.inputValue),
      value: null,
    }

    return allowNew ? [].concat(newTagOption, suggestions) : suggestions
  }, [allowNew, newTagText, suggestions])
}
