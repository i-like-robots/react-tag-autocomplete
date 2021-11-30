import React, { useCallback, useMemo } from 'react'
import type { ClassNames, TagSelected } from '../sharedTypes'

export type TagProps = TagSelected & {
  classNames: ClassNames
  index: number
  // TODO
  onDelete: (value: TagSelected['value']) => void
  removeButtonText: string
}

export function Tag({
  classNames,
  label,
  onDelete,
  removeButtonText,
  value,
}: TagProps): JSX.Element {
  const onClick = useCallback(() => onDelete(value), [onDelete, value])
  const ariaLabel = useMemo(
    () => removeButtonText.replace('%label%', label),
    [label, removeButtonText]
  )

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
