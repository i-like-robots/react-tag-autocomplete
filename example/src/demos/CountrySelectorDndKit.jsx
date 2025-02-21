import React, { useCallback, useState } from 'react'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { ReactTags } from '../../../src'
import { suggestions } from '../countries'
import { arrayMove } from '@dnd-kit/sortable'
import { tagToKey } from '../../../src/lib'

export function CountrySelectorDndKit() {
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

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <p>Select the countries you have visited below:</p>
      <ReactTags
        id="country-selector-dnd-kit"
        dndProvider="dnd-kit"
        labelText="Select countries"
        onAdd={onAdd}
        onDelete={onDelete}
        selected={selected}
        suggestions={suggestions}
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
