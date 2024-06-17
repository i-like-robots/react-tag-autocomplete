import React, { useCallback, useState } from 'react'
import { ReactTags } from '../../../src'
import { suggestions } from '../countries'

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

  function groupChildrenByFirstCharacter(children) {
    const groups = {}

    children.forEach((child) => {
      const suggestion = suggestions.find((suggestion) =>
        child.key.endsWith(`${suggestion.value}-${suggestion.label}`)
      )
      const firstChar = suggestion.label.charAt(0).toUpperCase()

      groups[firstChar] ??= []
      groups[firstChar].push({ suggestion, child })
    })

    return groups
  }

  function CustomTagList({ children, classNames, ...tagListProps }) {
    const groupedTags = groupChildrenByFirstCharacter(React.Children.toArray(children))

    return (
      <>
        {Object.keys(groupedTags).map((key) => (
          <div key={key} className="tag-group">
            <p>{`Countries starting with the letter "${key}":`}</p>
            <ul className={classNames.tagList} {...tagListProps}>
              {groupedTags[key].map(({ suggestion, child }) => (
                <li className={classNames.tagListItem} key={suggestion.value}>
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
        ariaDescribedBy="custom-tagList-description"
        collapseOnSelect
        id="custom-tagList-demo"
        labelText="Enter new tags"
        onAdd={onAdd}
        onDelete={onDelete}
        selected={selected}
        suggestions={suggestions}
        renderTagList={CustomTagList}
      />
    </>
  )
}
