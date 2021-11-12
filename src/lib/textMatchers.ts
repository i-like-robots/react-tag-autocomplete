import type { SuggestedTag } from '../sharedTypes'

function escapeForRegExp(string: string): string {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

export function partialRegExp(query: string): RegExp {
  return new RegExp(`(?:^|\\s)${escapeForRegExp(query)}`, 'i')
}

export function exactRegExp(query: string): RegExp {
  return new RegExp(`^${escapeForRegExp(query)}$`, 'i')
}

export function matchPartial(query: string): (value: string) => boolean {
  const regexp = partialRegExp(query)
  return (value) => regexp.test(value)
}

export function matchExact(query: string): (value: string) => boolean {
  const regexp = exactRegExp(query)
  return (value) => regexp.test(value)
}

export function matchSuggestionsPartial(
  query: string,
  suggestions: SuggestedTag[]
): SuggestedTag[] {
  const matcher = matchPartial(query)
  return suggestions.filter((item) => matcher(item.label))
}

export function findSuggestionIndex(value: string | number, suggestions: SuggestedTag[]): number {
  return suggestions.findIndex((item) => item.value === value)
}

export function findSuggestionExact(
  query: string,
  suggestions: SuggestedTag[]
): SuggestedTag | null {
  const matcher = matchExact(query)
  return suggestions.find((item) => matcher(item.label)) || null
}
