import React from 'react'
import { Tag } from '.'
import { ClassNames, TagSelected } from '../sharedTypes'

export type TagListProps = {
  classNames: ClassNames
  onDelete: (index: number) => void
  removeButtonText: string
  tags: TagSelected[]
  tagListTitleText: string
}

export function TagList({
  classNames,
  onDelete,
  removeButtonText,
  tags,
  tagListTitleText,
}: TagListProps): JSX.Element {
  return (
    <>
      <ul className={classNames.selected} aria-label={tagListTitleText}>
        {tags.map((tag, index) => (
          <li className={classNames.selectedItem} key={tag.value} role="listitem">
            <Tag
              classNames={classNames}
              index={index}
              onDelete={() => onDelete(index)}
              removeButtonText={removeButtonText}
              {...tag}
            />
          </li>
        ))}
      </ul>
      {/* TODO */}
      <div aria-live="polite" hidden role="status"></div>
    </>
  )
}
