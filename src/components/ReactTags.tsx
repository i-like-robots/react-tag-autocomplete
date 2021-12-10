import React, { useRef } from 'react'
import { useKeepFocus, useComboBox, useListManager, useOptions, useSelectTag } from '../hooks'
import { ComboBox, Input, ListBox, Option, Root, Tag, TagList } from '.'
import { InternalRefs } from '../contexts/'
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

  const selectTag = useSelectTag(listManager, {
    allowNew,
    onAddition,
  })

  const { comboBoxProps, inputProps, isExpanded, listBoxProps } = useComboBox(listManager, {
    comboBoxRef,
    id,
    inputRef,
    listBoxRef,
    selectTag,
  })

  const options = useOptions(listManager, { id, selectTag })

  return (
    <InternalRefs.Provider value={{ rootRef: containerRef, comboBoxRef, listBoxRef, inputRef }}>
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
        <ComboBox classNames={classNames} comboBoxProps={comboBoxProps}>
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
                <Option
                  classNames={classNames}
                  key={`${option.value}-${option.label}`}
                  {...option}
                />
              ))}
            </ListBox>
          ) : null}
        </ComboBox>
      </Root>
    </InternalRefs.Provider>
  )
}
