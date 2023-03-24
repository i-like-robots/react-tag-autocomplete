import React, { useCallback, useState } from 'react'
import { ReactTags } from '../../../src'

function debounce(fn, delay = 100) {
  let timeoutID

  return function (...args) {
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => fn(...args), delay)
  }
}

async function fetchData(value) {
  try {
    const query = encodeURIComponent(value)

    const response = await fetch(`https://swapi.dev/api/people/?search=${query}`)

    if (response.ok) {
      const data = await response.json()
      return data.results.map((item) => ({ value: item.url, label: item.name }))
    } else {
      throw Error(`The API returned a ${response.status}`)
    }
  } catch (error) {
    console.error(error)
    return []
  }
}

export function AsyncSuggestions() {
  const [state, setState] = useState({
    isBusy: false,
    selected: [],
    suggestions: [],
  })

  const onAdd = useCallback(
    (newTag) => {
      setState({ ...state, selected: [...state.selected, newTag], suggestions: [] })
    },
    [state]
  )

  const onDelete = useCallback(
    (index) => {
      setState({ ...state, selected: state.selected.filter((_, i) => i !== index) })
    },
    [state]
  )

  const onInput = useCallback(
    debounce(async (value) => {
      if (state.isBusy) return

      setState({ ...state, isBusy: true })

      try {
        const suggestions = await fetchData(value)
        setState({ ...state, suggestions, isBusy: false })
      } catch (error) {
        setState({ ...state, isBusy: false })
      }
    }),
    [state]
  )

  const noOptionsText =
    state.isBusy && !state.suggestions.length ? 'Loading...' : 'No characters found'

  return (
    <>
      <p id="async-suggestions-description">Select your favourite Star Wars characters below:</p>
      <ReactTags
        ariaDescribedBy="async-suggestions-description"
        id="async-suggestions-demo"
        labelText="Select characters"
        noOptionsText={noOptionsText}
        onAdd={onAdd}
        onDelete={onDelete}
        onInput={onInput}
        placeholderText="Start typing..."
        selected={state.selected}
        suggestions={state.suggestions}
      />
      <p>
        Demo powered by the <a href="https://swapi.dev/">The Star Wars API</a>
      </p>
    </>
  )
}
