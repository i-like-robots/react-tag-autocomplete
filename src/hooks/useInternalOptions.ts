import { useMemo } from 'react'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type { OnValidate, Tag, TagSuggestion } from '../sharedTypes'

export type InternalOptionsArgs = {
  newOptionText: string
  noOptionsText: string
  onValidate?: OnValidate
}

export type InternalOptionsValue<T extends Tag> = {
  newTagOption: (value: string) => TagSuggestion<T>
  noTagsOption: (value: string) => TagSuggestion<T>
}

export function useInternalOptions<T extends Tag>({
  newOptionText,
  noOptionsText,
  onValidate,
}: InternalOptionsArgs): InternalOptionsValue<T> {
  return useMemo(() => {
    return {
      newTagOption(value: string): TagSuggestion<T> {
        const disabled = typeof onValidate === 'function' ? !onValidate(value) : false

        return {
          disabled,
          label: newOptionText,
          value: NewOptionValue,
        } as TagSuggestion<T> // FIXME
      },
      noTagsOption(): TagSuggestion<T> {
        return {
          disabled: true,
          label: noOptionsText,
          value: NoOptionsValue,
        } as TagSuggestion<T> // FIXME
      },
    }
  }, [newOptionText, noOptionsText, onValidate])
}
