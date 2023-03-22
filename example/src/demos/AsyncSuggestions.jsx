import React, { useCallback, useState } from 'react'
import { ReactTags } from '../../../src'

function debounce(fn, delay = 100) {
  let timeoutID

  return function (...args) {
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => fn(...args), delay)
  }
}

function wait(delay = 100) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

async function fetchData(value) {
  try {
    const query = encodeURIComponent(value)

    await wait()

    const response = await fetch(
      `https://api.openbrewerydb.org/breweries/autocomplete?query=${query}`
    )

    if (response.ok) {
      const json = await response.json()
      return json.map((item) => ({ value: item.id, label: item.name }))
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

      setState({ ...state, suggestions: [], isBusy: true })

      try {
        const suggestions = await fetchData(value)

        if (suggestions) {
          setState({ ...state, suggestions, isBusy: false })
        }
      } catch (error) {
        console.error(error)
        setState({ isBusy: false })
      }
    }),
    [state]
  )

  const noOptionsText =
    state.isBusy && !state.suggestions.length ? 'Loading...' : 'No breweries found'

  return (
    <>
      <p id="async-suggestions-description">
        Select the breweries you have visited using React Tags below:
      </p>
      <ReactTags
        ariaDescribedBy="async-suggestions-description"
        id="async-suggestions-demo"
        labelText="Select breweries"
        noOptionsText={noOptionsText}
        onAdd={onAdd}
        onDelete={onDelete}
        onInput={onInput}
        placeholderText="Start typing..."
        selected={state.selected}
        suggestions={state.suggestions}
      />
      <p>
        Demo powered by the <a href="https://www.openbrewerydb.org/">Open Brewery DB</a>
      </p>
    </>
  )
}
