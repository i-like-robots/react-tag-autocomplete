import React, { useCallback } from 'react'
import type { ClassNames, SelectedTag } from '../sharedTypes'

export type TagProps = SelectedTag & {
  classNames: ClassNames
  index: number
  // TODO
  onDelete: (value: SelectedTag['value']) => void
  removeButtonText: string
}

export function Tag({ classNames, label, onDelete, removeButtonText, value }: TagProps): JSX.Element {
  const onClick = useCallback(() => onDelete(value), [onDelete, value])

  return (
    <button
      type="button"
      className={classNames.selectedTag}
      title={removeButtonText}
      onClick={onClick}
    >
      <span className={classNames.selectedTagName}>{label}</span>
    </button>
  )
}
