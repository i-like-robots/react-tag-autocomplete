import React, { useCallback, useState } from 'react'
import { ReactTags } from '../../../src'

function isValid(value) {
  return /^[a-z]{4,12}$/i.test(value)
}

export function CustomTags() {
  const [selected, setSelected] = useState([])

  const onAdd = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
    },
    [selected]
  )

  const onDelete = useCallback(
    (tagIndex) => {
      setSelected(selected.filter((_, i) => i !== tagIndex))
    },
    [selected]
  )

  const onValidate = useCallback((value) => isValid(value), [])

  return (
    <>
      <p>Enter new tags meeting the requirements below:</p>
      <ReactTags
        allowNew
        ariaDescribedBy="custom-tags-description"
        collapseOnSelect
        id="custom-tags-demo"
        labelText="Enter new tags"
        onAdd={onAdd}
        onDelete={onDelete}
        onValidate={onValidate}
        selected={selected}
        suggestions={[]}
      />
      <p id="custom-tags-description" style={{ color: 'gray' }}>
        <em>Tags must be between 4 and 12 characters in length and only contain the letters A-Z</em>
      </p>
    </>
  )
}
