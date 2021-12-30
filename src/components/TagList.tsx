import React, { useContext } from 'react'
import type { TagProps } from './'
import type { ClassNames } from '../sharedTypes'
import { GlobalContext } from '../contexts'

export type TagListProps = {
  children: React.ReactElement<TagProps>[]
  classNames: ClassNames
  tagListTitleText: string
}

export function TagList({ children, classNames, tagListTitleText }: TagListProps): JSX.Element {
  const { tagListRef } = useContext(GlobalContext)

  return (
    <>
      <ul className={classNames.tagList} aria-label={tagListTitleText} ref={tagListRef}>
        {children.map((child) => (
          <li className={classNames.tagListItem} key={child.key} role="listitem">
            {child}
          </li>
        ))}
      </ul>
      {/* TODO */}
      <div aria-live="polite" hidden role="status"></div>
    </>
  )
}
