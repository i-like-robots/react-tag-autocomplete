import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useSelectedTag } from '../hooks'
import type { ClassNames } from '../sharedTypes'

type TagComponentProps = React.ComponentPropsWithoutRef<'button'> & {
  classNames: ClassNames
  label: string
}

function TagComponent({ classNames, label, ...tagProps }: TagComponentProps): JSX.Element {
  return (
    <button type="button" className={classNames.tag} {...tagProps}>
      <span className={classNames.tagName}>{label}</span>
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
  const { label, tagProps } = useSelectedTag(index, title)

  return render({ classNames, label, ...tagProps })
}
