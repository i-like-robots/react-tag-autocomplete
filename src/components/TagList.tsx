import React from 'react'
import type { TagProps } from './'
import type { ClassNames } from '../sharedTypes'

export type TagListProps = {
  children: React.ReactElement<TagProps>[]
  classNames: ClassNames
  tagListTitleText: string
}

export function TagList({ children, classNames, tagListTitleText }: TagListProps): JSX.Element {
  return (
    <>
      <ul className={classNames.selected} aria-label={tagListTitleText}>
        {children.map((child) => (
          <li className={classNames.selectedItem} key={child.key} role="listitem">
            {child}
          </li>
        ))}
      </ul>
      {/* TODO */}
      <div aria-live="polite" hidden role="status"></div>
    </>
  )
}
