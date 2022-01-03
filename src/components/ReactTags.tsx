import React, { useRef } from 'react'
import { tagToKey } from '../lib'
import { GlobalContext } from '../contexts'
import { useListManager } from '../hooks'
import { ComboBox, Input, Label, ListBox, ListBoxEmpty, Option, Root, Tag, TagList } from '.'
import type { ClassNames, OnAddition, OnDelete, TagSelected, TagSuggestion } from '../sharedTypes'

const DefaultClassNames: ClassNames = {
  root: 'react-tags',
  rootIsActive: 'is-active',
  rootIsDisabled: 'is-disabled',
  rootIsInvalid: 'is-invalid',
  label: 'react-tags__label',
  tagList: 'react-tags__list',
  tagListItem: 'react-tags__list-item',
  tag: 'react-tags__tag',
  tagName: 'react-tags__tag-name',
  comboBox: 'react-tags__combobox',
  input: 'react-tags__combobox-input',
  listBox: 'react-tags__listbox',
  listBoxEmpty: 'react-tags__listbox-empty',
  option: 'react-tags__listbox-option',
  optionIsActive: 'is-active',
}

export type ReactTagsProps = {
  // allowBackspace?: boolean
  allowNew?: boolean
  allowResize?: boolean
  ariaLabelText?: string
  classNames?: ClassNames
  id?: string
  isDisabled?: boolean
  isInvalid?: boolean
  listBoxEmptyText?: string
  newTagText?: string
  tagListTitleText?: string
  onAddition: OnAddition
  onDelete: OnDelete
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
  isInvalid = false,
  listBoxEmptyText = 'No options available',
  newTagText = 'Add %value%',
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
  const tagListRef = useRef<HTMLUListElement>()

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

  return (
    <GlobalContext.Provider
      value={{
        // classNames
        comboBoxRef,
        id,
        inputRef,
        isDisabled,
        isInvalid,
        listBoxRef,
        listManager,
        onAddition,
        onDelete,
        rootRef,
        tagListRef,
      }}
    >
      <Root classNames={classNames}>
        <Label ariaLabelText={ariaLabelText} classNames={classNames} />
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
            {listManager.state.results.length === 0 && (
              <ListBoxEmpty classNames={classNames}>{listBoxEmptyText}</ListBoxEmpty>
            )}
            {listManager.state.results.map((tag) => (
              <Option key={tagToKey(tag)} classNames={classNames} tag={tag} />
            ))}
          </ListBox>
        </ComboBox>
      </Root>
    </GlobalContext.Provider>
  )
}
