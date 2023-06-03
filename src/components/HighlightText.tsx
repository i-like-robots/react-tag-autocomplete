import React from 'react'
import { partialRegExp, replacePlaceholder } from '../lib'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type { Tag } from '../sharedTypes'

function sliceText(text: string, query: string): string[] {
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

export type HighlightTextProps = {
  option: Tag
  query: string
}

export function HighlightText({ option, query }: HighlightTextProps): JSX.Element {
  if (option.value === NewOptionValue || option.value === NoOptionsValue) {
    return <>{replacePlaceholder(option.label, query)}</>
  }

  if (query) {
    const result = sliceText(option.label, query)

    if (result) {
      return <>{[result[0], <mark className="highlight">{result[1]}</mark>, result[2]]}</>
    }
  }

  return <>{option.label}</>
}
