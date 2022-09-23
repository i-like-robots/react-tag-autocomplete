import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useSelectedTag } from '../hooks'
import type { ClassNames, TagSelected } from '../sharedTypes'

type TagRendererProps = React.ComponentPropsWithoutRef<'button'> & {
  classNames: ClassNames
  tag: TagSelected
}

export type TagRenderer = (props: TagRendererProps) => JSX.Element

const DefaultTag: TagRenderer = ({ classNames, tag, ...tagProps }) => {
  return (
    <button type="button" className={classNames.tag} {...tagProps}>
      <span className={classNames.tagName}>{tag.label}</span>
    </button>
  )
}

export type TagProps = {
  index: number
  render?: TagRenderer
  title: string
}

export function Tag({ render = DefaultTag, index, title }: TagProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { tag, tagProps } = useSelectedTag(index, title)

  return render({ classNames, tag, ...tagProps })
}
