import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import type { TagSelected } from '../sharedTypes'

export type TagProps = {
  onClick: () => void
  removeButtonText: string
  tag: TagSelected
}

export function Tag({ onClick, removeButtonText, tag }: TagProps): JSX.Element {
  const { classNames, isDisabled } = useContext(GlobalContext)

  return (
    <button
      type="button"
      aria-disabled={isDisabled}
      aria-label={removeButtonText.replace('%label%', tag.label)}
      className={classNames.tag}
      onClick={isDisabled ? null : onClick}
    >
      <span className={classNames.tagName}>{tag.label}</span>
    </button>
  )
}
