import React, { useCallback, useState } from 'react'
import { ReactTags } from '../../../src'
import { suggestions } from '../countries'

function isValid(value) {
  return /^[a-z]{4,12}$/i.test(value)
}

export function CustomTagList() {
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

  function getTagByTagKey(key, child) {
    return {
      suggestion: suggestions.find(
        (suggestion) => `${suggestion.value}-${suggestion.label}` === key
      ),
      child,
    }
  }

  function groupChildrenByFirstCharacter(mappedSuggestions) {
    return mappedSuggestions.reduce((acc, { suggestion, child }) => {
      if (suggestion) {
        const firstChar = suggestion.label.charAt(0).toUpperCase()
        if (!acc[firstChar]) {
          acc[firstChar] = []
        }
        acc[firstChar].push({ suggestion, child })
      }
      return acc
    }, {})
  }

  function CustomTagList({ children, label, classNames, listRef }) {
    const mappedSuggestions = children.map((child) => getTagByTagKey(child.key, child))
    const groupedSuggestions = groupChildrenByFirstCharacter(mappedSuggestions)

    return (
      <>
        {Object.keys(groupedSuggestions).map((key) => (
          <div key={key} className="tag-group">
            <h2>Countries starting with the letter "{key}"</h2>
            <ul className={classNames.tagList} aria-label={label} ref={listRef} role="list">
              {groupedSuggestions[key].map(({ suggestion, child }) => (
                <li className={classNames.tagListItem} key={suggestion.value} role="listitem">
                  {child}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    )
  }

  return (
    <>
      <p>Select the countries you have visited below. They will be grouped alphabetically:</p>
      <ReactTags
        allowNew
        ariaDescribedBy="custom-tagList-description"
        collapseOnSelect
        id="custom-tagList-demo"
        labelText="Enter new tags"
        onAdd={onAdd}
        onDelete={onDelete}
        onValidate={onValidate}
        selected={selected}
        suggestions={suggestions}
        renderTagList={CustomTagList}
      />
    </>
  )
}
