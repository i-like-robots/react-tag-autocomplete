import React from 'react'
import { usePrevious } from '../hooks'
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
  selected: TagSelected[]
}

function Announcements({ selected }: AnnouncementsProps): JSX.Element {
  // NOTE: There is no previous value on first render
  const prevSelected = usePrevious<TagSelected[]>(selected) || selected

  const logs: string[] = []

  selected.forEach((tag) => {
    if (!prevSelected.includes(tag)) logs.push(`Selected tag ${tag.label}`)
  })

  prevSelected.forEach((tag) => {
    if (!selected.includes(tag)) logs.push(`Removed tag ${tag.label}`)
  })

  return (
    <div aria-live="polite" role="status" style={VisuallyHiddenStyles}>
      {logs.join('\n')}
    </div>
  )
}

const MemoizedAnnouncements = React.memo(Announcements)

export { MemoizedAnnouncements as Announcements }
