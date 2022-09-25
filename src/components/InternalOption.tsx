import React from 'react'
import { replacePlaceholder } from '../lib'

export type InternalOptionTextProps = {
  label: string
  query: string
}

function InternalOptionText({ label, query }: InternalOptionTextProps): JSX.Element {
  return <span>{replacePlaceholder(label, query)}</span>
}

const MemoizedInternalOptionText = React.memo(InternalOptionText)

export { MemoizedInternalOptionText as InternalOptionText }
