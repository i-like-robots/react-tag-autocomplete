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
    api.current.input.value = ''
  }, [api])

  // NOTE: if focus moves from the component input to this button then the listbox will be
  // closed immediately so this avoids toggling it instantly back to its previous state
  const skipToggle = useRef(false)

  const toggle = useCallback(() => {
    if (skipToggle.current) {
      skipToggle.current = false
    } else {
      api.current.listBox.isExpanded ? api.current.listBox.collapse() : api.current.listBox.expand()
    }
  }, [api])

  const toggleCapture = useCallback(
    (e) => {
      if (api.current.listBox.isExpanded && e.target !== document.activeElement) {
        skipToggle.current = true
      }
    },
    [api]
  )

  return (
    <>
      <p>Use the buttons below to control the component:</p>
      <p style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" onClick={focus}>
          Focus input
        </button>
        <button type="button" onClick={clear}>
          Clear input value
        </button>
        <button type="button" onClick={toggle} onMouseDown={toggleCapture}>
          Toggle listbox
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
