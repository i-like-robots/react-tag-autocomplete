import { useCallback } from 'react'
import { CreateNewOptionValue, NoOptionValue } from '../constants'
import { replacePlaceholder } from '../lib'
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
        disabled: onValidate ? !onValidate(value) : false,
        disableMarkText: true,
        label: replacePlaceholder(newTagText, value),
        value: CreateNewOptionValue,
      }
    },
    [newTagText, onValidate]
  )

  const noTagsOption = useCallback(
    (value: string): TagSuggestion => {
      return {
        disabled: true,
        disableMarkText: true,
        label: replacePlaceholder(noOptionsText, value),
        value: NoOptionValue,
      }
    },
    [noOptionsText]
  )

  return { newTagOption, noTagsOption }
}
