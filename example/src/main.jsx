import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { ReactTags } from '../../src'
import { countrySuggestions } from './countries'

/**
 * Demo 1 - Country selector
 */

function CountrySelector() {
  const [tags, setTags] = useState([])

  const onDelete = useCallback(
    (tagIndex) => {
      setTags(tags.filter((_, i) => i !== tagIndex))
    },
    [tags]
  )

  const onAddition = useCallback(
    (newTag) => {
      setTags([...tags, newTag])
      return true
    },
    [tags]
  )

  return (
    <>
      <p>Select the countries you have visited below:</p>
      <ReactTags
        ariaLabelText="Select countries"
        tags={tags}
        suggestions={countrySuggestions}
        noSuggestionsText="No matching countries"
        onDelete={onDelete}
        onAddition={onAddition}
      />
      <p>
        <b>Output:</b>
      </p>
      <pre>
        <code>{JSON.stringify(tags, null, 2)}</code>
      </pre>
    </>
  )
}

ReactDOM.render(<CountrySelector />, document.getElementById('demo-1'))

/**
 * Demo 2 - Custom tags
 */

function CustomTags() {
  const [tags, setTags] = useState([])

  const onDelete = useCallback(
    (tagIndex) => {
      setTags(tags.filter((_, i) => i !== tagIndex))
    },
    [tags]
  )

  const onAddition = useCallback(
    (newTag) => {
      if (/^[a-z]{3,12}$/i.test(newTag.label)) {
        setTags([...tags, newTag])
        return true
      }

      return false
    },
    [tags]
  )

  return (
    <>
      <p>Enter new tags meeting the requirements below:</p>
      <ReactTags
        allowNew
        ariaLabelText="Enter new tags"
        tags={tags}
        suggestions={[]}
        onDelete={onDelete}
        onAddition={onAddition}
      />
      <p style={{ margin: '0.25rem 0', color: 'gray' }}>
        <small>
          <em>Tags must be 3–12 characters in length and only contain the letters A-Z</em>
        </small>
      </p>
      <p>
        <b>Output:</b>
      </p>
      <pre>
        <code>{JSON.stringify(tags, null, 2)}</code>
      </pre>
    </>
  )
}

ReactDOM.render(<CustomTags />, document.getElementById('demo-2'))
