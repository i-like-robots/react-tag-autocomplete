import { NewOptionValue } from '../constants'
import { matchTagExact } from '.'
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
    matchTagExact(state.value, state.options)

  return tag && !tag.disabled ? tag : undefined
}

export function loopOptionsIndex(next: number, size: number, min: number): number {
  const max = size - 1

  if (next > max) {
    return min
  }

  if (next < min) {
    return max
  }

  return next
}
