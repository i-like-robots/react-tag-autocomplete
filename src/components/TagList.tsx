import React from 'react'
import type { ClassNames, TagSelected } from '../sharedTypes'

export type TagListProps = {
  classNames: ClassNames
  renderTag: (tag: TagSelected, index: number) => JSX.Element
  tags: TagSelected[]
  tagListTitleText: string
}

export function TagList({
  classNames,
  renderTag,
  tags,
  tagListTitleText,
}: TagListProps): JSX.Element {
  return (
    <>
      <ul className={classNames.selected} aria-label={tagListTitleText}>
        {tags.map((tag, index) => (
          <li className={classNames.selectedItem} key={`${tag.value}-${tag.label}`} role="listitem">
            {renderTag(tag, index)}
          </li>
        ))}
      </ul>
      {/* TODO */}
      <div aria-live="polite" hidden role="status"></div>
    </>
  )
}
