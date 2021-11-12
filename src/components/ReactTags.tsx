import React, { useRef } from 'react'
import { useActive, useListBox, useListManager, useOptions } from '../hooks'
import { Input, ListBox, Option, Tag } from '.'

import type { ClassNames, SelectedTag, SuggestedTag } from '../sharedTypes'

const DefaultClassNames: ClassNames = {
  root: 'react-tags',
  rootActive: 'is-active',
  selected: 'react-tags__selected',
  selectedTag: 'react-tags__selected-tag',
  selectedTagName: 'react-tags__selected-tag-name',
  search: 'react-tags__search',
  searchWrapper: 'react-tags__search-wrapper',
  searchInput: 'react-tags__search-input',
  suggestions: 'react-tags__suggestions',
  suggestionActive: 'is-active',
  suggestionDisabled: 'is-disabled',
  suggestionPrefix: 'react-tags__suggestion-prefix',
}

export type ReactTagsProps = {
  // allowBackspace?: boolean
  // allowNew?: boolean
  allowResize?: boolean
  ariaLabelText?: string
  classNames?: ClassNames
  // disabled?: boolean
  id?: string
  // invalid?: boolean
  // newTagText?: string
  // noSuggestionsText?: string
  onAddition: (tag: SuggestedTag) => void
  onDelete: (index: number) => void
  // onValidate: (query: string) => boolean
  placeholderText?: string
  removeButtonText?: string
  suggestions: SuggestedTag[]
  tags: SelectedTag[]
}

export function ReactTags({
  // allowBackspace = true,
  // allowNew = false,
  allowResize = true,
  ariaLabelText = 'Test label',
  classNames = DefaultClassNames,
  // disabled = false,
  id = 'react-tags',
  // invalid = false,
  // newTagText = 'Add',
  // noSuggestionsText = 'No matches found',
  onAddition,
  onDelete,
  // onValidate,
  placeholderText = 'Enter tag name',
  removeButtonText = 'Remove tag',
  suggestions = [],
  tags = [],
}: ReactTagsProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()

  const listManager = useListManager({
    results: [],
    suggestions,
    selectedIndex: -1,
    selectedTag: null,
    value: '',
  })

  const { containerProps, isActive } = useActive({ containerRef, inputRef })

  const { inputProps, isExpanded, listBoxProps } = useListBox(listManager, {
    id,
    onAddition,
  })
  const options = useOptions(listManager, { id, onAddition })

  const classes = [classNames.root]

  if (isActive) classes.push(classNames.rootActive)

  return (
    <div className={classes.join(' ')} {...containerProps}>
      <div className={classNames.selected} aria-relevant="additions removals" aria-live="polite">
        {tags.map((tag, index) => (
          <Tag
            classNames={classNames}
            index={index}
            // TODO
            onDelete={() => onDelete(index)}
            removeButtonText={removeButtonText}
            {...tag}
          />
        ))}
      </div>
      <div className={classNames.search}>
        <Input
          allowResize={allowResize}
          ariaLabelText={ariaLabelText}
          classNames={classNames}
          inputProps={inputProps}
          inputRef={inputRef}
          placeholderText={placeholderText}
        />
        {isExpanded ? (
          <ListBox classNames={classNames} listBoxProps={listBoxProps}>
            {options.map((option) => (
              <Option classNames={classNames} key={option.value} {...option} />
            ))}
          </ListBox>
        ) : null}
      </div>
    </div>
  )
}
