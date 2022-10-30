import React from 'react'
import { partialRegExp, replacePlaceholder } from '../lib'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type { TagOption } from '../sharedTypes'

function markText(name: string, value: string) {
  const regexp = partialRegExp(value)
  return name.replace(regexp, '<mark>$&</mark>')
}

export type OptionTextProps = {
  option: TagOption
  query: string
}

function OptionText({ option, query }: OptionTextProps): JSX.Element {
  if (option.value === NewOptionValue || option.value === NoOptionsValue) {
    return <span>{replacePlaceholder(option.label, query)}</span>
  } else {
    return <span dangerouslySetInnerHTML={{ __html: markText(option.label, query) }} />
  }
}

const MemoisedOptionText = React.memo(OptionText)

export { MemoisedOptionText as OptionText }
