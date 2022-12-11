import { NewOptionValue } from '../constants'
import { findSuggestionExact } from '.'
import type { ManagerState } from '../hooks'
import type { TagSuggestion } from '../sharedTypes'

function getNewTag(option: TagSuggestion | null, value: string): TagSuggestion | undefined {
  if (option?.value === NewOptionValue && option.disabled === false) {
    return { value: value, label: value }
  }
}

export function findSelectedOption(state: ManagerState): TagSuggestion | undefined {
  const tag =
    getNewTag(state.activeOption, state.value) ||
    state.activeOption ||
    findSuggestionExact(state.value, state.options)

  return tag && !tag.disabled ? tag : undefined
}
