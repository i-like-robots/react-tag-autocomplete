import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useSelectedTag } from '../hooks'
import type { ClassNames, TagSelected } from '../sharedTypes'
import { useSortable } from '@dnd-kit/sortable'
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { CSS } from '@dnd-kit/utilities'
import { tagToKey } from '../lib'

// tagRef: setNodeRef, style, listeners, attributes, classNames, tag, ...tagProps
type TagDndKitRendererProps = React.ComponentPropsWithoutRef<'button'> & {
  classNames: ClassNames
  tag: TagSelected
  setNodeRef: (element: HTMLElement | null) => void
  listeners: SyntheticListenerMap
  attributes: DraggableAttributes
}

export type TagDndKitRenderer = (props: TagDndKitRendererProps) => React.JSX.Element

const DefaultTag: TagDndKitRenderer = ({
  setNodeRef,
  style,
  listeners,
  attributes,
  classNames,
  tag,
  ...tagProps
}) => {
  return (
    <div
      ref={setNodeRef}
      style={{ display: 'inline-block', ...style }}
      className={classNames.tag}
      {...attributes}
    >
      <span className={classNames.tagName} {...listeners}>
        {tag.label}
      </span>
      <button type="button" className={classNames.tag} {...tagProps}></button>
    </div>
  )
}

export type TagDndKitProps = {
  index: number
  render?: TagDndKitRenderer
  title: string
}

export function TagDndKit({
  render = DefaultTag,
  index,
  title,
}: TagDndKitProps): React.JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { tag, tagProps } = useSelectedTag(index, title)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: tagToKey(tag),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return render({ setNodeRef, style, listeners, attributes, classNames, tag, ...tagProps })
}
