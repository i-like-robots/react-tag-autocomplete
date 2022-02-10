import React, { useContext } from 'react'
import { CreateNewOptionValue, NoOptionValue } from '../constants'
import { GlobalContext } from '../contexts'
import { replacePlaceholder } from '../lib'

export type InternalOptionTextProps = {
  query: string
  value: symbol
}

export function InternalOptionText({ query, value }: InternalOptionTextProps): JSX.Element {
  const { newTagText, noOptionsText } = useContext(GlobalContext)

  const map = {
    [CreateNewOptionValue]: newTagText,
    [NoOptionValue]: noOptionsText,
  }

  return <span>{replacePlaceholder(map[value], query)}</span>
}
