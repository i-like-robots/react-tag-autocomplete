import React from 'react'
import { useGlobalContext } from '../contexts'
import { Tag } from '../sharedTypes'
import type { TagProps } from './'

export type TagListProps<T extends Tag> = {
  children: React.ReactElement<TagProps<T>>[]
  label: string
}

export function TagList<T extends Tag>({ children, label }: TagListProps<T>): JSX.Element {
  const { classNames, tagListRef } = useGlobalContext<T>()

  return (
    <ul className={classNames.tagList} aria-label={label} ref={tagListRef} role="list">
      {children.map((child) => (
        <li className={classNames.tagListItem} key={child.key} role="listitem">
          {child}
        </li>
      ))}
    </ul>
  )
}
