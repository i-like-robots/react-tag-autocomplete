import { useMemo } from 'react'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type { OnValidate, TagSuggestion } from '../sharedTypes'

export type InternalOptionsArgs = {
  newOptionText: string
  noOptionsText: string
  onValidate?: OnValidate
}

export type InternalOptionsValue = {
  newTagOption: (value: string) => TagSuggestion
  noTagsOption: (value: string) => TagSuggestion
}

export function useInternalOptions({
  newOptionText,
  noOptionsText,
  onValidate,
}: InternalOptionsArgs): InternalOptionsValue {
  return useMemo(() => {
    return {
      newTagOption(value: string): TagSuggestion {
        const disabled = typeof onValidate === 'function' ? !onValidate(value) : false

        return {
          disabled,
          label: newOptionText,
          value: NewOptionValue,
        }
      },
      noTagsOption(): TagSuggestion {
        return {
          disabled: true,
          label: noOptionsText,
          value: NoOptionsValue,
        }
      },
    }
  }, [newOptionText, noOptionsText, onValidate])
}
