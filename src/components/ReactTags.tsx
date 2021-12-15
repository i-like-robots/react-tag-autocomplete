import React, { useRef } from 'react'
import { InternalRefs } from '../contexts'
import { useKeepFocus, useListManager, useOnSelect } from '../hooks'
import { ComboBox, Input, ListBox, Option, Root, Tag, TagList } from '.'
import type { ClassNames, TagSelected, TagSuggestion } from '../sharedTypes'

const DefaultClassNames: ClassNames = {
  root: 'react-tags',
  rootActive: 'is-active',
  selected: 'react-tags__selected',
  selectedItem: 'react-tags__selected-item',
  selectedTag: 'react-tags__selected-tag',
  selectedTagName: 'react-tags__selected-tag-name',
  search: 'react-tags__search',
  searchWrapper: 'react-tags__search-wrapper',
  searchInput: 'react-tags__search-input',
  suggestions: 'react-tags__suggestions',
  suggestionsItem: 'react-tags__suggestions-item',
  suggestionActive: 'is-active',
  suggestionDisabled: 'is-disabled',
  suggestionSelected: 'is-selected',
  suggestionPrefix: 'react-tags__suggestion-prefix',
}

export type ReactTagsProps = {
  // allowBackspace?: boolean
  allowNew?: boolean
  allowResize?: boolean
  ariaLabelText?: string
  classNames?: ClassNames
  // disabled?: boolean
  id?: string
  // invalid?: boolean
  newTagText?: string
  // noSuggestionsText?: string
  tagListTitleText?: string
  onAddition: (tag: TagSelected) => void
  onDelete: (index: number) => void
  // onValidate: (value: string) => boolean
  placeholderText?: string
  removeButtonText?: string
  suggestions: TagSuggestion[]
  tags: TagSelected[]
}

export function ReactTags({
  // allowBackspace = true,
  allowNew = false,
  allowResize = true,
  ariaLabelText = 'Test label',
  classNames = DefaultClassNames,
  // disabled = false,
  id = 'react-tags',
  // invalid = false,
  newTagText = 'Add %value%',
  // noSuggestionsText = 'No matches found',
  tagListTitleText = 'Selected tags',
  onAddition,
  onDelete,
  // onValidate,
  placeholderText = 'Add a tag',
  removeButtonText = 'Remove %label% from the list',
  suggestions = [],
  tags = [],
}: ReactTagsProps): JSX.Element {
  // TODO: move refs into context
  const comboBoxRef = useRef<HTMLDivElement>()
  const containerRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()
  const listBoxRef = useRef<HTMLDivElement>()

  useKeepFocus({ containerRef, tags })

  const listManager = useListManager({
    allowNew,
    newTagText,
    results: [],
    suggestions,
    selectedIndex: -1,
    selectedTag: null,
    value: '',
  })

  const onSelect = useOnSelect(listManager, onAddition)

  return (
    <InternalRefs.Provider
      value={{
        rootRef: containerRef,
        comboBoxRef,
        id,
        listBoxRef,
        listManager,
        inputRef,
        onSelect,
      }}
    >
      <Root classNames={classNames}>
        <TagList
          classNames={classNames}
          tags={tags}
          tagListTitleText={tagListTitleText}
          renderTag={(tag, index) => (
            <Tag
              classNames={classNames}
              onClick={() => onDelete(index)}
              removeButtonText={removeButtonText}
              {...tag}
            />
          )}
        />
        <ComboBox classNames={classNames}>
          <Input
            allowResize={allowResize}
            ariaLabelText={ariaLabelText}
            classNames={classNames}
            placeholderText={placeholderText}
          />
          <ListBox classNames={classNames}>
            {listManager.state.results.map((tag) => (
              <Option
                key={`${tag.value}-${tag.label}`}
                classNames={classNames}
                tag={tag}
              />
            ))}
          </ListBox>
        </ComboBox>
      </Root>
    </InternalRefs.Provider>
  )
}
