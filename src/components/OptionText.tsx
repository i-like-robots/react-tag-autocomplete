import React from 'react'
import { partialRegExp, replacePlaceholder } from '../lib'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type { TagOption } from '../sharedTypes'

function markText(name: string, value: string, tagName: string, className: string): string {
  if (value) {
    const regexp = partialRegExp(value)
    return name.replace(regexp, `<${tagName} class=${className}>$&</${tagName}>`)
  } else {
    return name
  }
}

export type OptionTextProps = {
  option: TagOption
  query: string
}

function OptionText({ option, query }: OptionTextProps): JSX.Element {
  if (option.value === NewOptionValue || option.value === NoOptionsValue) {
    return <span>{replacePlaceholder(option.label, query)}</span>
  } else {
    const html = markText(option.label, query, 'mark', 'highlighted')
    return <span dangerouslySetInnerHTML={{ __html: html }} />
  }
}

const MemoisedOptionText = React.memo(OptionText)

export { MemoisedOptionText as OptionText }
