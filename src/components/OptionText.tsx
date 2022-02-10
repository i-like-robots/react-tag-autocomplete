import React from 'react'
import { partialRegExp } from '../lib'

function markText(name: string, value: string) {
  const regexp = partialRegExp(value)
  return name.replace(regexp, '<mark>$&</mark>')
}

export type OptionTextProps = {
  label: string
  query: string
}

function OptionText({ label, query }: OptionTextProps): JSX.Element {
  return <span dangerouslySetInnerHTML={{ __html: markText(label, query) }} />
}

const MemoizedOptionText = React.memo(OptionText)

export { MemoizedOptionText as OptionText }
