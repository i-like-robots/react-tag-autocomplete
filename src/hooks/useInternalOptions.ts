import { useCallback } from 'react'
import { CreateNewOptionValue, NoOptionValue } from '../constants'
import type { OnValidate, TagSuggestion } from '../sharedTypes'

export type InternalOptionsArgs = {
  newTagText: string
  noOptionsText: string
  onValidate: OnValidate
}

export type InternalOptionsValue = {
  newTagOption: (value: string) => TagSuggestion
  noTagsOption: (value: string) => TagSuggestion
}

export function useInternalOptions({
  newTagText,
  noOptionsText,
  onValidate,
}: InternalOptionsArgs): InternalOptionsValue {
  const newTagOption = useCallback(
    (value: string): TagSuggestion => {
      return {
        disabled: !onValidate?.(value) || false,
        label: newTagText,
        value: CreateNewOptionValue,
      }
    },
    [newTagText, onValidate]
  )

  const noTagsOption = useCallback((): TagSuggestion => {
    return {
      disabled: true,
      label: noOptionsText,
      value: NoOptionValue,
    }
  }, [noOptionsText])

  return { newTagOption, noTagsOption }
}
