import React, { useRef } from 'react'
import { useGlobalContext } from '../contexts'
import { replacePlaceholder } from '../lib'

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
  const { manager } = useGlobalContext()

  const logsRef = useRef<string[]>([])

  manager.flags.tagsAdded.forEach((tag) => {
    logsRef.current.push(replacePlaceholder(ariaAddedText, tag.label))
  })

  manager.flags.tagsDeleted.forEach((tag) => {
    logsRef.current.push(replacePlaceholder(ariaDeletedText, tag.label))
  })

  return (
    <div aria-live="polite" aria-relevant="additions" role="status" style={VisuallyHiddenStyles}>
      {logsRef.current.join('\n')}
    </div>
  )
}
