import React, { useContext } from 'react'
import { useTagList } from '../hooks'
import { GlobalContext } from '../contexts'
import type { TagProps } from './'
import type { ClassNames } from '../sharedTypes'

type TagListRendererProps = React.ComponentPropsWithoutRef<'ul'> & {
  children: React.ReactElement<TagProps>[]
  classNames: ClassNames
  label: string
  listRef: React.MutableRefObject<HTMLUListElement>
}

export type TagListRenderer = (props: TagListRendererProps) => JSX.Element

const DefaultTagList: TagListRenderer = ({
  children,
  label,
  classNames,
  listRef,
}: TagListRendererProps) => {
  return (
    <ul className={classNames.tagList} aria-label={label} ref={listRef} role="list">
      {children.map((child) => (
        <li className={classNames.tagListItem} key={child.key} role="listitem">
          {child}
        </li>
      ))}
    </ul>
  )
}

export type TagListProps = {
  children: React.ReactElement<TagProps>[]
  label: string
  render?: TagListRenderer
}

export function TagList({ children, label, render = DefaultTagList }: TagListProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { listRef } = useTagList()

  return render({ classNames, children, label, listRef })
}
