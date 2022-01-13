import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useSelectedTag } from '../hooks'

export type TagProps = {
  title: string
  index: number
}

export function Tag({ index, title }: TagProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { tag, tagProps } = useSelectedTag(index, title)

  return (
    <button type="button" className={classNames.tag} {...tagProps}>
      <span className={classNames.tagName}>{tag.label}</span>
    </button>
  )
}
