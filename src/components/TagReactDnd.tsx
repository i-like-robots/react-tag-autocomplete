import React, { useContext, useRef } from 'react'
import { GlobalContext } from '../contexts'
import { useSelectedTag } from '../hooks'
import type { ClassNames, TagSelected } from '../sharedTypes'
import { useDrag, useDrop } from 'react-dnd'

type TagReactDndRendererProps = React.ComponentPropsWithoutRef<'button'> & {
  classNames: ClassNames
  tag: TagSelected
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerId: any
  tagRef: React.RefObject<HTMLElement>
  isDragging: boolean
}

export type TagReactDndRenderer = (props: TagReactDndRendererProps) => React.JSX.Element
export type MoveTag = (dragIndex: number, hoverIndex: number) => void

const ItemTypes = { TAG: 'tag' }

const DefaultTag: TagReactDndRenderer = ({
  tagRef,
  handlerId,
  classNames,
  tag,
  isDragging,
  ...tagProps
}) => {
  return (
    <span
      ref={tagRef}
      className={classNames.tag}
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
    >
      <span className={classNames.tagName}>{tag.label}</span>
      <button type="button" className={classNames.tag} {...tagProps}></button>
    </span>
  )
}

export type TagReactDndProps = {
  index: number
  render?: TagReactDndRenderer
  title: string
  moveTag: MoveTag
}

interface DragItem {
  index: number
}

export function TagReactDnd({
  render = DefaultTag,
  index,
  title,
  moveTag,
}: TagReactDndProps): React.JSX.Element {
  const { id, classNames } = useContext(GlobalContext)
  const { tag, tagProps } = useSelectedTag(index, title)
  const tagRef = useRef(null)

  const [{ handlerId }, dropRef] = useDrop(
    () => ({
      accept: `${ItemTypes.TAG}-${id}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collect: (monitor: any) => ({
        handlerId: monitor.getHandlerId(),
      }),
      hover: (item: DragItem, monitor) => {
        if (!tagRef.current) return

        const dragIndex = item.index
        const hoverIndex = index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) return

        // Determine rectangle on screen
        const hoverBoundingRect = tagRef.current?.getBoundingClientRect()

        // Get horizontal middle
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the left
        const hoverClientX = clientOffset.x - hoverBoundingRect.left

        // Only perform the move when the mouse has crossed half of the items width
        // When dragging left, only move when the cursor is below 50%
        // When dragging right, only move when the cursor is above 50%
        // Dragging left
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return
        // Dragging right
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return

        // Time to actually perform the action
        moveTag?.(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex
      },
    }),
    [index]
  )

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: `${ItemTypes.TAG}-${id}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collect: (monitor: any) => ({
        isDragging: !!monitor.isDragging(),
      }),
      item: { index },
    }),
    [index]
  )

  dragRef(dropRef(tagRef))

  return render({ tagRef, handlerId, classNames, tag, isDragging, ...tagProps })
}
