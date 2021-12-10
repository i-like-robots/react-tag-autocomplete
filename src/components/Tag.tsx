import React from 'react'
import type { ClassNames, TagSelected } from '../sharedTypes'

export type TagProps = TagSelected & {
  classNames: ClassNames
  onClick: () => void
  removeButtonText: string
}

export function Tag({ classNames, label, onClick, removeButtonText }: TagProps): JSX.Element {
  const ariaLabel = removeButtonText.replace('%label%', label)

  return (
    <button
      type="button"
      className={classNames.selectedTag}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className={classNames.selectedTagName}>{label}</span>
    </button>
  )
}
