import React, { useContext } from 'react'
import { partialRegExp, replacePlaceholder } from '../lib'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type { ClassNames, Tag } from '../sharedTypes'
import { GlobalContext } from '../contexts'

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

type HighlightRendererProps = {
  text: string
  classNames: ClassNames
}

export type HighlightRenderer = React.FunctionComponent<HighlightRendererProps>

const DefaultHighlightText: HighlightRenderer = ({ text }) => {
  return <mark className="highlight">{text}</mark>
}

export type HighlightTextProps = {
  option: Tag
  query: string
  render?: HighlightRenderer
}

export function HighlightText({
  option,
  query,
  render = DefaultHighlightText,
}: HighlightTextProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)

  if (option.value === NewOptionValue || option.value === NoOptionsValue) {
    return <>{replacePlaceholder(option.label, query)}</>
  }

  if (query) {
    const result = sliceText(option.label, query)

    if (result) {
      return <>{[result[0], render({ text: result[1], classNames }), result[2]]}</>
    }
  }

  return <>{option.label}</>
}
