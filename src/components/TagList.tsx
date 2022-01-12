import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import type { TagProps } from './'

export type TagListProps = {
  children: React.ReactElement<TagProps>[]
  tagListTitleText: string
}

export function TagList({ children, tagListTitleText }: TagListProps): JSX.Element {
  const { classNames, tagListRef } = useContext(GlobalContext)

  return (
    <ul className={classNames.tagList} aria-label={tagListTitleText} ref={tagListRef}>
      {children.map((child) => (
        <li className={classNames.tagListItem} key={child.key} role="listitem">
          {child}
        </li>
      ))}
    </ul>
  )
}
