import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { ReactTags } from '../../src'
import { suggestions } from './countries'

/**
 * Demo 1 - country selector with options
 */

function CountrySelector() {
  const [selected, setSelected] = useState([suggestions[10], suggestions[121]])

  const [options, setOptions] = useState({
    allowBackspace: false,
    allowTab: false,
    closeOnSelect: false,
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

  return (
    <>
      <p>Select the countries you have visited below:</p>
      <ReactTags
        id="demo-1"
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
            name="allowTab"
            checked={options.allowTab}
            onChange={onOptionChange}
          />
          Allow tab key to trigger selection
        </label>
        <label>
          <input
            type="checkbox"
            name="closeOnSelect"
            checked={options.closeOnSelect}
            onChange={onOptionChange}
          />
          Close the listbox on select
        </label>
      </fieldset>
      <details>
        <summary>View output</summary>
        <pre>
          <code>{JSON.stringify(selected, null, 2)}</code>
        </pre>
      </details>
    </>
  )
}

ReactDOM.render(<CountrySelector />, document.getElementById('demo-1'))

/**
 * Demo 2 - custom tags
 */

function isValid(value) {
  return /^[a-z]{4,12}$/i.test(value)
}

function CustomTags() {
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
        ariaDescribedBy="description-2"
        closeOnSelect
        id="demo-2"
        labelText="Enter new tags"
        onAdd={onAdd}
        onDelete={onDelete}
        onValidate={onValidate}
        selected={selected}
        suggestions={[]}
      />
      <p id="description-2" style={{ color: 'gray' }}>
        <em>Tags must be between 4 and 12 characters in length and only contain the letters A-Z</em>
      </p>
    </>
  )
}

ReactDOM.render(<CustomTags />, document.getElementById('demo-2'))

/**
 * Demo 3 - custom validity
 */

function CustomValidity() {
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

  const length = 3

  return (
    <>
      <p id="description-3">
        Please select <em>exactly</em> {length} tags:
      </p>
      <ReactTags
        ariaDescribedBy="description-3"
        ariaErrorMessage="error"
        id="demo-3"
        isInvalid={selected.length !== length}
        labelText="Select countries"
        onDelete={onDelete}
        onAdd={onAdd}
        selected={selected}
        suggestions={suggestions}
      />
      {selected.length < length ? (
        <p id="error" style={{ color: '#fd5956' }}>
          You must to select {length - selected.length} more tags
        </p>
      ) : null}
      {selected.length > length ? (
        <p id="error" style={{ color: '#fd5956' }}>
          You must remove {selected.length - length} tags
        </p>
      ) : null}
    </>
  )
}

ReactDOM.render(<CustomValidity />, document.getElementById('demo-3'))

/**
 * Demo 4 - async suggestions
 */

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

function AsyncSuggestions() {
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
      <p id="description-4">Select the breweries you have visited using React Tags below:</p>
      <ReactTags
        ariaDescribedBy="description-4"
        id="demo-4"
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

ReactDOM.render(<AsyncSuggestions />, document.getElementById('demo-4'))
