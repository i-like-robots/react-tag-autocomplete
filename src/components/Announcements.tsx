import React from 'react'
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
  selected: TagSelected[]
}

function Announcements({
  ariaAddedText,
  ariaRemovedText,
  selected,
}: AnnouncementsProps): JSX.Element {
  // NOTE: There is no previous value on first render
  const prevSelected = usePrevious<TagSelected[]>(selected) || selected

  const logs: string[] = []

  selected.forEach((tag) => {
    if (!prevSelected.includes(tag)) {
      logs.push(replacePlaceholder(ariaAddedText, tag.label))
    }
  })

  prevSelected.forEach((tag) => {
    if (!selected.includes(tag)) {
      logs.push(replacePlaceholder(ariaRemovedText, tag.label))
    }
  })

  return (
    <div aria-live="polite" role="status" style={VisuallyHiddenStyles}>
      {logs.join('\n')}
    </div>
  )
}

const MemoizedAnnouncements = React.memo(Announcements)

export { MemoizedAnnouncements as Announcements }
