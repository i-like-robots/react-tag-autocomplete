import React, { useContext } from 'react'
import { highlightText, replacePlaceholder } from '../lib'
import { NewOptionValue, NoOptionsValue } from '../constants'
import { GlobalContext } from '../contexts'
import type { ClassNames, Tag } from '../sharedTypes'

type HighlightRendererProps = {
  text: string
  classNames: ClassNames
}

export type HighlightRenderer = React.FunctionComponent<HighlightRendererProps>

const DefaultHighlight: HighlightRenderer = ({ classNames, text }) => {
  return <mark className={classNames.highlight}>{text}</mark>
}

export type HighlightProps = {
  option: Tag
  query: string
  render?: HighlightRenderer
}

function Highlight({ option, query, render = DefaultHighlight }: HighlightProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)

  let contents: React.ReactNode = option.label

  if (option.value === NewOptionValue || option.value === NoOptionsValue) {
    contents = replacePlaceholder(option.label, query)
  }

  if (query) {
    const result = highlightText(option.label, query)

    if (result) {
      const highlighted = render({ text: result[1], classNames })
      contents = [result[0], highlighted, result[2]]
    }
  }

  return <>{contents}</>
}

const MemoizedHighlight = React.memo(Highlight)

export { MemoizedHighlight as Highlight }
