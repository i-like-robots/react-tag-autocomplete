import React from 'react'
import type { ClassNames } from '../sharedTypes'

export type TagListProps = React.PropsWithChildren<{
  classNames: ClassNames
  onDelete: (index: number) => void
  tagListTitleText: string
}>

export function TagList({
  children = [],
  classNames,
  tagListTitleText,
}: TagListProps): JSX.Element {
  return (
    <>
      <ul className={classNames.selected} aria-label={tagListTitleText}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return (
              <li
                className={classNames.selectedItem}
                key={`${child.props.value}-${child.props.label}`}
                role="listitem"
              >
                {child}
              </li>
            )
          }
        })}
      </ul>
      {/* TODO */}
      <div aria-live="polite" hidden role="status"></div>
    </>
  )
}
