import React from 'react'
import { partialRegExp } from '../lib'

function markIt(name: string, value: string) {
  const regexp = partialRegExp(value)
  return name.replace(regexp, '<mark>$&</mark>')
}

export type OptionTextProps = {
  label: string
  value: string
}

function OptionText({ label, value }: OptionTextProps): JSX.Element {
  return <span dangerouslySetInnerHTML={{ __html: markIt(label, value) }} />
}

const MemoizedOptionText = React.memo(OptionText)

export { MemoizedOptionText as OptionText }
