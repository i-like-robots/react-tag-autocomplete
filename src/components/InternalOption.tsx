import React from 'react'
import { replacePlaceholder } from '../lib'

export type InternalOptionTextProps = {
  label: string
  query: string
}

export function InternalOptionText({ label, query }: InternalOptionTextProps): JSX.Element {
  return <span>{replacePlaceholder(label, query)}</span>
}
