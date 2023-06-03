import { partialRegExp } from '.'

const ReplaceRegExp = /%value%/

export function replacePlaceholder(string: string, value: string): string {
  return string.replace(ReplaceRegExp, value)
}

export function highlightText(text: string, query: string): string[] {
  const regexp = partialRegExp(query)
  const matches = text.match(regexp)

  if (matches) {
    const match = matches[0]
    const lastIndex = matches.index + match.length

    return [
      text.slice(0, matches.index),
      text.slice(matches.index, lastIndex),
      text.slice(lastIndex),
    ]
  }
}
