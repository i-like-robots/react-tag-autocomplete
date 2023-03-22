import React, { useCallback, useState } from 'react'
import { ReactTags } from '../../../src'
import { suggestions } from '../countries'

const SELECTED_LENGTH = 3

export function CustomValidity() {
  const [selected, setSelected] = useState([])

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

  return (
    <>
      <p id="custom-validity-description">
        Please select <em>exactly</em> {SELECTED_LENGTH} tags:
      </p>
      <ReactTags
        ariaDescribedBy="custom-validity-description"
        ariaErrorMessage="error"
        id="custom-validity-demo"
        isInvalid={selected.length !== SELECTED_LENGTH}
        labelText="Select countries"
        onDelete={onDelete}
        onAdd={onAdd}
        selected={selected}
        suggestions={suggestions}
      />
      {selected.length < SELECTED_LENGTH ? (
        <p id="error" style={{ color: '#fd5956' }}>
          You must to select {SELECTED_LENGTH - selected.length} more tags
        </p>
      ) : null}
      {selected.length > SELECTED_LENGTH ? (
        <p id="error" style={{ color: '#fd5956' }}>
          You must remove {selected.length - SELECTED_LENGTH} tags
        </p>
      ) : null}
    </>
  )
}
