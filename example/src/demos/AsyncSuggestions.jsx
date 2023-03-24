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
  const [isBusy, setIsBusy] = useState(false)
  const [selected, setSelected] = useState([])
  const [suggestions, setSuggestions] = useState([])

  const onAdd = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
      setSuggestions([])
    },
    [selected]
  )

  const onDelete = useCallback(
    (index) => {
      setSelected(selected.filter((_, i) => i !== index))
    },
    [selected]
  )

  const onInput = useCallback(
    debounce(async (value) => {
      if (isBusy) return

      setIsBusy(true)

      try {
        const suggestions = await fetchData(value)
        setSuggestions(suggestions)
      } catch (error) {
        console.error(error)
      } finally {
        setIsBusy(false)
      }
    }),
    [isBusy]
  )

  const noOptionsText = isBusy && !suggestions.length ? 'Loading...' : 'No characters found'

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
        selected={selected}
        suggestions={suggestions}
      />
      <p>
        Demo powered by the <a href="https://swapi.dev/">The Star Wars API</a>
      </p>
    </>
  )
}
