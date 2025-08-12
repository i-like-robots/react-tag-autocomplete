import React, { useCallback, useState } from 'react'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ReactTags } from '../../../src'
import { suggestions } from '../countries'
import { closestCenter, DndContext } from '@dnd-kit/core'

const tagToKey = (tag) => {
  return `${String(tag.value)}-${tag.label}`
}

const Handle = (props) => {
  const { isDragging, ...remainingProps } = props

  return (
    <span
      className="react-tags__handleTag"
      style={{ cursor: `${isDragging ? 'grabbing' : 'grab'}` }}
      {...remainingProps}
    >
      <svg viewBox="0 0 20 20" width="12" fill="currentColor">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </span>
  )
}

export function CountrySelectorDnD() {
  const [selected, setSelected] = useState([suggestions[10], suggestions[121]])

  const [options, setOptions] = useState({
    activateFirstOption: false,
    allowBackspace: false,
    collapseOnSelect: false,
    isDisabled: false,
    isInvalid: false,
  })

  const onAdd = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
    },
    [selected]
  )

  const onDelete = useCallback(
    (index) => {
      setSelected(selected.filter((_, i) => i !== index))
    },
    [selected]
  )

  const onOptionChange = useCallback(
    (e) => {
      setOptions({ ...options, [e.target.name]: e.target.checked })
    },
    [options]
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setSelected((selected) => {
        const oldIndex = selected.findIndex((s) => tagToKey(s) === active.id)
        const newIndex = selected.findIndex((s) => tagToKey(s) === over.id)
        return arrayMove(selected, oldIndex, newIndex)
      })
    }
  }

  const CustomTagList = ({ children, classNames, ...tagListprops }) => {
    return (
      <SortableContext items={React.Children.map(children, (child) => child.key)}>
        <ul className={classNames.tagList} {...tagListprops}>
          {React.Children.map(children, (child) => (
            <li className={classNames.tagListItem} key={child.key}>
              {child}
            </li>
          ))}
        </ul>
      </SortableContext>
    )
  }

  const CustomTag = ({ classNames, tag, ...tagProps }) => {
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
      id: tagToKey(tag),
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <div style={{ display: 'inline-block', ...style }} className="react-tags__dndtag">
        <span
          ref={setNodeRef}
          style={{ display: 'inline-block' }}
          className={classNames.tagName}
          {...attributes}
        >
          <Handle isDragging={isDragging} {...listeners} />
          {tag.label}
        </span>
        <span
          className="react-tags__removeTag"
          {...tagProps}
          onClick={() => onDelete(selected.findIndex((s) => tagToKey(s) === tagToKey(tag)))}
        ></span>
      </div>
    )
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <p>Select the countries you have visited below:</p>
      <ReactTags
        id="country-selector"
        labelText="Select countries"
        onAdd={onAdd}
        onDelete={onDelete}
        selected={selected}
        suggestions={suggestions}
        renderTagList={CustomTagList}
        renderTag={CustomTag}
        {...options}
      />
      <fieldset>
        <legend>Options</legend>
        <label>
          <input
            type="checkbox"
            name="isDisabled"
            checked={options.isDisabled}
            onChange={onOptionChange}
          />
          Disable component
        </label>
        <label>
          <input
            type="checkbox"
            name="isInvalid"
            checked={options.isInvalid}
            onChange={onOptionChange}
          />
          Mark as invalid
        </label>
        <label>
          <input
            type="checkbox"
            name="allowBackspace"
            checked={options.allowBackspace}
            onChange={onOptionChange}
          />
          Allow backspace key to delete selected tags
        </label>
        <label>
          <input
            type="checkbox"
            name="collapseOnSelect"
            checked={options.collapseOnSelect}
            onChange={onOptionChange}
          />
          Automatically collapse the listbox on select
        </label>
        <label>
          <input
            type="checkbox"
            name="activateFirstOption"
            checked={options.activateFirstOption}
            onChange={onOptionChange}
          />
          Automatically activate the first option when listbox expands
        </label>
      </fieldset>
      <details>
        <summary>View output</summary>
        <pre>
          <code>{JSON.stringify(selected, null, 2)}</code>
        </pre>
      </details>
    </DndContext>
  )
}
