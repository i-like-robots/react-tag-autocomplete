import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { ReactTags } from '../../src'
import { suggestions } from './countries'

/**
 * Demo 1 - Country selector
 */

function CountrySelector() {
  const [selected, setSelected] = useState([])

  const onDelete = useCallback(
    (index) => {
      setSelected(selected.filter((_, i) => i !== index))
      return true
    },
    [selected]
  )

  const onAddition = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
      return true
    },
    [selected]
  )

  return (
    <>
      <p>Select the countries you have visited below:</p>
      <ReactTags
        labelText="Select countries"
        selected={selected}
        suggestions={suggestions}
        onDelete={onDelete}
        onAddition={onAddition}
        noSuggestionsText="No matching countries"
      />
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
 * Demo 2 - AllowCustom tags
 */

function AllowCustomTags() {
  const [selected, setSelected] = useState([])

  const onDelete = useCallback(
    (tagIndex) => {
      setSelected(selected.filter((_, i) => i !== tagIndex))
      return true
    },
    [selected]
  )

  const onAddition = useCallback(
    (newTag) => {
      if (/^[a-z]{3,12}$/i.test(newTag.label)) {
        setSelected([...selected, newTag])
        return true
      }

      alert(`The tag you entered is not valid`)

      return false
    },
    [selected]
  )

  return (
    <>
      <p>Enter new tags meeting the requirements below:</p>
      <ReactTags
        allowNew
        labelText="Enter new tags"
        selected={selected}
        suggestions={[]}
        onDelete={onDelete}
        onAddition={onAddition}
      />
      <p style={{ margin: '0.25rem 0', color: 'gray' }}>
        <small>
          <em>Tags must be 3–12 characters in length and only contain the letters A-Z</em>
        </small>
      </p>
      <details>
        <summary>View output</summary>
        <pre>
          <code>{JSON.stringify(selected, null, 2)}</code>
        </pre>
      </details>
    </>
  )
}

ReactDOM.render(<AllowCustomTags />, document.getElementById('demo-2'))

/**
 * Demo 3 - custom validity
 */

function CustomValidity() {
  const [selected, setSelected] = useState([])

  const onDelete = useCallback(
    (index) => {
      setSelected(selected.filter((_, i) => i !== index))
      return true
    },
    [selected]
  )

  const onAddition = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
      return true
    },
    [selected]
  )

  const isInvalid = selected.length > 0 && selected.length !== 3

  return (
    <>
      <p>Please select 3 tags:</p>
      <ReactTags
        labelText="Select countries"
        isInvalid={isInvalid}
        selected={selected}
        suggestions={suggestions}
        onDelete={onDelete}
        onAddition={onAddition}
        noSuggestionsText="No matching countries"
      />
      <details>
        <summary>View output</summary>
        <pre>
          <code>{JSON.stringify(selected, null, 2)}</code>
        </pre>
      </details>
    </>
  )
}

ReactDOM.render(<CustomValidity />, document.getElementById('demo-3'))

/**
 * Demo 4 - disabled input
 */

function DisabledInput() {
  const onDelete = () => {}
  const onAddition = () => {}

  return (
    <ReactTags
      labelText="Select countries"
      isDisabled={true}
      noSuggestionsText="No matching countries"
      onDelete={onDelete}
      onAddition={onAddition}
      selected={[suggestions[10], suggestions[200]]}
      suggestions={suggestions}
    />
  )
}

ReactDOM.render(<DisabledInput />, document.getElementById('demo-4'))

/**
 * Demo 5 - async suggestions
 */

async function fetchData(query) {
  try {
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
  const [value, setValue] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [selected, setSelected] = useState([])
  const [suggestions, setSuggestions] = useState([])

  const onDelete = useCallback(
    (index) => {
      setSelected(selected.filter((_, i) => i !== index))
      return true
    },
    [selected]
  )

  const onAddition = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
      setSuggestions([])
      return true
    },
    [selected]
  )

  const onInputChange = useCallback(
    async (query) => {
      setValue(query)

      if (!isBusy) {
        setIsBusy(true)

        try {
          const suggestions = await fetchData(query)

          if (suggestions) setSuggestions(suggestions)
        } catch (error) {
          alert('Oh no!')
        }

        setIsBusy(false)
      }
    },
    [isBusy]
  )

  const noSuggestionsText = isBusy ? 'Loading...' : 'No breweries found'

  return (
    <>
      <p>
        Select the breweries you have visited using React Tags below (powered by the{' '}
        <a href="https://www.openbrewerydb.org/">Open Brewery DB</a>):
      </p>
      <ReactTags
        labelText="Select breweries"
        noSuggestionsText={noSuggestionsText}
        onDelete={onDelete}
        onAddition={onAddition}
        onInput={onInputChange}
        placeholderText="Start typing to fetch suggestions"
        selected={selected}
        suggestions={suggestions}
      />
    </>
  )
}

ReactDOM.render(<AsyncSuggestions />, document.getElementById('demo-5'))
