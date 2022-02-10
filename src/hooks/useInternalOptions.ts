import { useCallback } from 'react'
import { CreateNewOptionValue, NoOptionValue } from '../constants'
import type { OnValidate, TagSuggestion } from '../sharedTypes'

export type InternalOptionsArgs = {
  onValidate: OnValidate
}

export type InternalOptionsValue = {
  newTagOption: (value: string) => TagSuggestion
  noTagsOption: (value: string) => TagSuggestion
}

export function useInternalOptions({ onValidate }: InternalOptionsArgs): InternalOptionsValue {
  const newTagOption = useCallback(
    (value: string): TagSuggestion => {
      return {
        disabled: typeof onValidate === 'function' ? !onValidate(value) : false,
        label: '',
        value: CreateNewOptionValue,
      }
    },
    [onValidate]
  )

  const noTagsOption = useCallback((): TagSuggestion => {
    return {
      disabled: true,
      label: '',
      value: NoOptionValue,
    }
  }, [])

  return { newTagOption, noTagsOption }
}
