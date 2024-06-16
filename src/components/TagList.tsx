import React, { useContext } from 'react'
import { useTagList } from '../hooks'
import { GlobalContext } from '../contexts'
import type { TagProps } from './'
import type { ClassNames } from '../sharedTypes'

type TagListRendererProps = React.ComponentPropsWithRef<'ul'> & {
  classNames: ClassNames
}

export type TagListRenderer = (props: TagListRendererProps) => JSX.Element

const DefaultTagList: TagListRenderer = ({
  children,
  classNames,
  ...tagListProps
}: TagListRendererProps) => {
  return (
    <ul className={classNames.tagList} {...tagListProps} role="list">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return (
            <li className={classNames.tagListItem} key={child.key} role="listitem">
              {child}
            </li>
          )
        }
      })}
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
  const tagListProps = useTagList({ label })

  return render({ classNames, children, ...tagListProps })
}
