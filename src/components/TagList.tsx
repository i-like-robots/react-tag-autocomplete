import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import type { TagProps } from './'

export type TagListProps = {
  children: React.ReactElement<TagProps>[]
  label: string
}

export function TagList({ children, label }: TagListProps): JSX.Element {
  const { classNames, tagListRef } = useContext(GlobalContext)

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
