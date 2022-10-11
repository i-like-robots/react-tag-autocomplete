import React from 'react'
import { useGlobalContext } from '../contexts'
import { useSelectedTag } from '../hooks'
import type { ClassNames, Tag, TagSelected } from '../sharedTypes'

type TagRendererProps<T extends Tag> = React.ComponentPropsWithoutRef<'button'> & {
  classNames: ClassNames
  tag: TagSelected<T>
}

export type TagRenderer<T extends Tag> = (props: TagRendererProps<T>) => JSX.Element

const DefaultTag = <T extends Tag>({ classNames, tag, ...tagProps }: TagRendererProps<T>) => {
  return (
    <button type="button" className={classNames.tag} {...tagProps}>
      <span className={classNames.tagName}>{tag.label}</span>
    </button>
  )
}

export type TagProps<T extends Tag> = {
  index: number
  render?: TagRenderer<T>
  title: string
}

export function Tag<T extends Tag>({
  render = DefaultTag,
  index,
  title,
}: TagProps<T>): JSX.Element {
  const { classNames } = useGlobalContext<T>()
  const { tag, tagProps } = useSelectedTag<T>(index, title)

  return render({ classNames, tag, ...tagProps })
}
