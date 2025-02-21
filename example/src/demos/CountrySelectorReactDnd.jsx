import React, { useCallback, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ReactTags } from '../../../src'
import { suggestions } from '../countries'

export function CountrySelectorReactDnd() {
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

  const handleDrag = useCallback(
    (dragIndex, hoverIndex) => {
      setSelected((prevSelected) => {
        let newSelected = [...prevSelected]

        // Move item
        newSelected.splice(dragIndex, 1)
        newSelected.splice(hoverIndex, 0, prevSelected[dragIndex])

        // re-render
        return newSelected
      })
    },
    [selected]
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <p>Select the countries you have visited below:</p>
      <ReactTags
        id="country-selector-react-dnd"
        dndProvider="react-dnd"
        labelText="Select countries"
        onAdd={onAdd}
        onDelete={onDelete}
        selected={selected}
        suggestions={suggestions}
        handleDrag={handleDrag}
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
    </DndProvider>
  )
}
