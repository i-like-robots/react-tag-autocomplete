import type { TagSuggestion } from '../sharedTypes'

const EscapeRegExp = /[-\\^$*+?.()|[\]{}]/g

function escapeForRegExp(string: string): string {
  return string.replace(EscapeRegExp, '\\$&')
}

export function partialRegExp(query: string): RegExp {
  return new RegExp(`${escapeForRegExp(query)}`, 'i')
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
  suggestions: TagSuggestion[]
): TagSuggestion[] {
  if (query === '') {
    return [].concat(suggestions)
  } else {
    const matcher = matchPartial(query)
    return suggestions.filter((item) => matcher(item.label))
  }
}

export function findSuggestionExact(
  query: string,
  suggestions: TagSuggestion[]
): TagSuggestion | null {
  const matcher = matchExact(query)
  return suggestions.find((item) => matcher(item.label)) || null
}
