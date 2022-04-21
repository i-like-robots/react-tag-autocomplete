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
  ariaDeletedText: string
}

export function Announcements({ ariaAddedText, ariaDeletedText }: AnnouncementsProps): JSX.Element {
  const { manager } = useContext(GlobalContext)
  const { selected } = manager.state

  const prevSelected = usePrevious<TagSelected[]>(selected)

  const logsRef = useRef<string[]>([])

  selected.forEach((tag) => {
    if (!prevSelected.includes(tag)) {
      logsRef.current.push(replacePlaceholder(ariaAddedText, tag.label))
    }
  })

  prevSelected.forEach((tag) => {
    if (!selected.includes(tag)) {
      logsRef.current.push(replacePlaceholder(ariaDeletedText, tag.label))
    }
  })

  return (
    <div aria-live="polite" aria-relevant="additions" role="status" style={VisuallyHiddenStyles}>
      {logsRef.current.join('\n')}
    </div>
  )
}
