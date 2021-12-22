import React, { useRef } from 'react'
import { tagToKey } from '../lib'
import { InternalRefs } from '../contexts'
import { useListManager, useOnSelect } from '../hooks'
import { ComboBox, Input, Label, ListBox, Option, Root, Tag, TagList } from '.'
import type { ClassNames, TagSelected, TagSuggestion } from '../sharedTypes'

const DefaultClassNames: ClassNames = {
  root: 'react-tags',
  rootActive: 'is-active',
  rootDisabled: 'is-disabled',
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
}

export type ReactTagsProps = {
  // allowBackspace?: boolean
  allowNew?: boolean
  allowResize?: boolean
  ariaLabelText?: string
  classNames?: ClassNames
  id?: string
  isDisabled?: boolean
  // invalid?: boolean
  newTagText?: string
  // noSuggestionsText?: string
  tagListTitleText?: string
  onAddition: (tag: TagSelected) => boolean
  onDelete: (index: number) => boolean
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
  ariaLabelText = 'Select tags',
  classNames = DefaultClassNames,
  id = 'react-tags',
  isDisabled = false,
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
  const comboBoxRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()
  const listBoxRef = useRef<HTMLDivElement>()
  const rootRef = useRef<HTMLDivElement>()

  const listManager = useListManager({
    activeIndex: -1,
    activeTag: null,
    allowNew,
    newTagText,
    results: [],
    selectedKeys: null,
    selectedTags: tags,
    suggestions,
    value: '',
  })

  const onSelect = useOnSelect(listManager, isDisabled, onAddition, onDelete)

  return (
    <InternalRefs.Provider
      value={{
        comboBoxRef,
        id,
        inputRef,
        isDisabled,
        listBoxRef,
        listManager,
        onSelect,
        rootRef,
      }}
    >
      <Root classNames={classNames}>
        <Label ariaLabelText={ariaLabelText} />
        <TagList classNames={classNames} tagListTitleText={tagListTitleText}>
          {tags.map((tag, index) => (
            <Tag
              key={tagToKey(tag)}
              classNames={classNames}
              onClick={() => onDelete(index)}
              removeButtonText={removeButtonText}
              tag={tag}
            />
          ))}
        </TagList>
        <ComboBox classNames={classNames}>
          <Input
            allowResize={allowResize}
            classNames={classNames}
            placeholderText={placeholderText}
          />
          <ListBox classNames={classNames}>
            {listManager.state.results.map((tag) => (
              <Option key={tagToKey(tag)} classNames={classNames} tag={tag} />
            ))}
          </ListBox>
        </ComboBox>
      </Root>
    </InternalRefs.Provider>
  )
}
