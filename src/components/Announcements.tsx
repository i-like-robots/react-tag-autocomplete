import React, { useContext, useRef } from 'react'
import { GlobalContext } from '../contexts'
import { usePrevious } from '../hooks'
import { replacePlaceholder } from '../lib'
import type { TagSelected } from '../sharedTypes'

const VisuallyHiddenStyles: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  left: -9999,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
}

export type AnnouncementsProps = {
  ariaAddedText: string
  ariaRemovedText: string
}

export function Announcements({ ariaAddedText, ariaRemovedText }: AnnouncementsProps): JSX.Element {
  const { manager } = useContext(GlobalContext)
  const { selected } = manager.state

  // NOTE: There is no previous value on first render
  const prevSelected = usePrevious<TagSelected[]>(selected) || selected

  const logsRef = useRef<string[]>([])

  selected.forEach((tag) => {
    if (!prevSelected.includes(tag)) {
      logsRef.current.push(replacePlaceholder(ariaAddedText, tag.label))
    }
  })

  prevSelected.forEach((tag) => {
    if (!selected.includes(tag)) {
      logsRef.current.push(replacePlaceholder(ariaRemovedText, tag.label))
    }
  })

  return (
    <div aria-live="polite" aria-relevant="additions" role="status" style={VisuallyHiddenStyles}>
      {logsRef.current.join('\n')}
    </div>
  )
}
