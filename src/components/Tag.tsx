import React from 'react'
import type { ClassNames, TagSelected } from '../sharedTypes'

export type TagProps = {
  classNames: ClassNames
  onClick: () => void
  removeButtonText: string
  tag: TagSelected
}

export function Tag({ classNames, onClick, removeButtonText, tag }: TagProps): JSX.Element {
  const ariaLabel = removeButtonText.replace('%label%', tag.label)

  return (
    <button
      type="button"
      className={classNames.selectedTag}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className={classNames.selectedTagName}>{tag.label}</span>
    </button>
  )
}
