import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { ReactTags } from '../../src'
import { suggestions } from './countries'

/**
 * Demo 1 - Country selector
 */

function CountrySelector() {
  const [selected, setSelected] = useState([suggestions[10], suggestions[121]])
  const [isInvalid, setIsInvalid] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [closeOnSelect, setCloseOnSelect] = useState(false)
  const [allowBackspace, setAllowBackspace] = useState(false)
  const [allowTab, setAllowTab] = useState(false)

  const onDelete = useCallback(
    (index) => {
      setSelected(selected.filter((_, i) => i !== index))
    },
    [selected]
  )

  const onAddition = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
    },
    [selected]
  )

  return (
    <>
      <p>Select the countries you have visited below:</p>
      <ReactTags
        allowBackspace={allowBackspace}
        allowTab={allowTab}
        closeOnSelect={closeOnSelect}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        labelText="Select countries"
        selected={selected}
        suggestions={suggestions}
        onDelete={onDelete}
        onAddition={onAddition}
        noSuggestionsText="No matching countries"
      />
      <fieldset>
        <legend>Options</legend>
        <label>
          <input type="checkbox" checked={isDisabled} onChange={() => setIsDisabled(!isDisabled)} />
          Disable component
        </label>
        <label>
          <input type="checkbox" checked={isInvalid} onChange={() => setIsInvalid(!isInvalid)} />
          Mark as invalid
        </label>
        <label>
          <input
            type="checkbox"
            checked={allowBackspace}
            onChange={() => setAllowBackspace(!allowBackspace)}
          />
          Allow backspace key to delete selected tags
        </label>
        <label>
          <input type="checkbox" checked={allowTab} onChange={() => setAllowTab(!allowTab)} />
          Allow tab key to trigger selection
        </label>
        <label>
          <input
            type="checkbox"
            checked={closeOnSelect}
            onChange={() => setCloseOnSelect(!closeOnSelect)}
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
 * Demo 2 - AllowCustom tags
 */

function isValid(value) {
  return /^[a-z]{3,12}$/i.test(value)
}

function AllowCustomTags() {
  const [selected, setSelected] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const onDelete = useCallback(
    (tagIndex) => {
      setSelected(selected.filter((_, i) => i !== tagIndex))
    },
    [selected]
  )

  const onAddition = useCallback(
    (newTag) => {
      if (isValid(newTag.label)) {
        setSelected([...selected, newTag])
        setErrorMessage('')
      } else {
        setErrorMessage('The tag is not valid')
      }
    },
    [selected]
  )

  return (
    <>
      <p>Enter new tags meeting the requirements below:</p>
      <ReactTags
        allowNew
        closeOnSelect={true}
        labelText="Enter new tags"
        selected={selected}
        suggestions={[]}
        onDelete={onDelete}
        onAddition={onAddition}
      />
      {errorMessage ? (
        <p style={{ margin: '0.25rem 0', color: '#fd5956' }}>{errorMessage}</p>
      ) : null}
      <p style={{ margin: '0.25rem 0', color: 'gray' }}>
        <small>
          <em>Tags must be 3–12 characters in length and only contain the letters A-Z</em>
        </small>
      </p>
    </>
  )
}

ReactDOM.render(<AllowCustomTags />, document.getElementById('demo-2'))

/**
 * Demo 3 - custom validity
 */

function CustomValidity() {
  const [selected, setSelected] = useState([])

  const isValid = selected.length === 3

  const onDelete = useCallback(
    (index) => {
      setSelected(selected.filter((_, i) => i !== index))
      return true
    },
    [selected]
  )

  const onAddition = useCallback(
    (newTag) => {
      if (!isValid) {
        setSelected([...selected, newTag])
        return true
      }

      return false
    },
    [isValid, selected]
  )

  return (
    <>
      <p>
        Please select <em>exactly</em> 3 tags:
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <ReactTags
            labelText="Select countries"
            isInvalid={!isValid}
            selected={selected}
            suggestions={suggestions}
            onDelete={onDelete}
            onAddition={onAddition}
            noSuggestionsText="No matching countries"
          />
        </div>
        <div style={{ fontSize: '1.75rem' }} role="status">
          {selected.length === 3 ? '🥳' : '😞'}
        </div>
      </div>
    </>
  )
}

ReactDOM.render(<CustomValidity />, document.getElementById('demo-3'))

/**
 * Demo 4 - async suggestions
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
    async (value) => {
      if (!isBusy) {
        setIsBusy(true)

        try {
          const suggestions = await fetchData(value)

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

ReactDOM.render(<AsyncSuggestions />, document.getElementById('demo-4'))
