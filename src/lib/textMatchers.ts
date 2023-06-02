import type { TagSuggestion } from '../sharedTypes'

const EscapeRegExp = /[-\\^$*+?.()|[\]{}]/g

function escapeForRegExp(string: string): string {
  return string.replace(EscapeRegExp, '\\$&')
}

export function partialRegExp(query: string): RegExp {
  return new RegExp(escapeForRegExp(query), 'i')
}

export function exactRegExp(query: string): RegExp {
  return new RegExp(`^${escapeForRegExp(query)}$`, 'i')
}

export function matchTagsPartial(query: string, suggestions: TagSuggestion[]): TagSuggestion[] {
  if (query === '') {
    return [].concat(suggestions)
  } else {
    const regexp = partialRegExp(query)
    return suggestions.filter((item) => regexp.test(item.label))
  }
}

export function matchTagExact(query: string, suggestions: TagSuggestion[]): TagSuggestion | null {
  const regexp = exactRegExp(query)
  return suggestions.find((item) => regexp.test(item.label)) || null
}
