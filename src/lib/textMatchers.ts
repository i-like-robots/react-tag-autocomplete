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
  if (query) {
    const regexp = partialRegExp(query)
    return suggestions.filter((item) => regexp.test(item.label))
  } else {
    return [].concat(suggestions)
  }
}

export function matchTagExact(query: string, suggestions: TagSuggestion[]): TagSuggestion | null {
  const regexp = exactRegExp(query)
  return suggestions.find((item) => regexp.test(item.label)) || null
}
