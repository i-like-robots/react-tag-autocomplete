import React, { useCallback, useRef, useState } from 'react'
import { ReactTags } from '../../../src'
import { suggestions } from '../countries'

export function UsingTheAPI() {
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

  const api = useRef(null)

  const focus = useCallback(() => {
    api.current.input.focus()
  }, [api])

  const clear = useCallback(() => {
    api.current.input.clear()
  }, [api])

  const toggle = useCallback(() => {
    api.current.listBox.isExpanded ? api.current.listBox.collapse() : api.current.listBox.expand()
  }, [api])

  return (
    <>
      <p>Use the buttons below to control the component:</p>
      <p>
        <button type="button" onClick={focus}>
          Focus input
        </button>
        <button type="button" onClick={clear}>
          Clear input value
        </button>
        <button type="button" onClick={toggle}>
          Toggle options list
        </button>
      </p>
      <ReactTags
        id="using-the-api-demo"
        labelText="Select countries"
        onAdd={onAdd}
        onDelete={onDelete}
        ref={api}
        selected={selected}
        suggestions={suggestions}
      />
    </>
  )
}
