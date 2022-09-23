import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useSelectedTag } from '../hooks'
import type { ClassNames, TagSelected } from '../sharedTypes'

type TagComponentProps = React.ComponentPropsWithoutRef<'button'> & {
  classNames: ClassNames
  tag: TagSelected
}

function TagComponent({ classNames, tag, ...tagProps }: TagComponentProps): JSX.Element {
  return (
    <button type="button" className={classNames.tag} {...tagProps}>
      <span className={classNames.tagName}>{tag.label}</span>
    </button>
  )
}

export type TagProps = {
  render?: (props: TagComponentProps) => JSX.Element
  title: string
  index: number
}

export function Tag({ render = TagComponent, index, title }: TagProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { tag, tagProps } = useSelectedTag(index, title)

  return render({ classNames, tag, ...tagProps })
}
