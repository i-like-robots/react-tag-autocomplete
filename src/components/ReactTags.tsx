import React, { useRef } from 'react'
import { tagToKey } from '../lib'
import { GlobalContext } from '../contexts'
import { useListManager } from '../hooks'
import {
  Announcements,
  ComboBox,
  Input,
  Label,
  ListBox,
  NoOptions,
  Option,
  Root,
  Tag,
  TagList,
} from '.'
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
  noOptions: 'react-tags__listbox-no-options',
  option: 'react-tags__listbox-option',
  optionIsActive: 'is-active',
}

export type ReactTagsProps = {
  allowBackspace?: boolean
  allowNew?: boolean
  allowResize?: boolean
  ariaLabelText?: string
  classNames?: ClassNames
  id?: string
  isDisabled?: boolean
  isInvalid?: boolean
  noOptionsText?: string
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
  allowBackspace = true,
  allowNew = false,
  allowResize = true,
  ariaLabelText = 'Select tags',
  classNames = DefaultClassNames,
  id = 'react-tags',
  isDisabled = false,
  isInvalid = false,
  noOptionsText = 'No options found',
  newTagText = 'Add %value%',
  tagListTitleText = 'Selected tags', // TODO
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
    activeOption: null,
    allowNew,
    newTagText,
    options: [],
    selectedKeys: null,
    selectedTags: tags,
    suggestions,
    value: '',
  })

  return (
    <GlobalContext.Provider
      value={{
        classNames,
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
      <Root>
        <Label>{ariaLabelText}</Label>
        <TagList tagListTitleText={tagListTitleText}>
          {listManager.state.selectedTags.map((tag, index) => (
            <Tag key={tagToKey(tag)} index={index} title={removeButtonText} />
          ))}
        </TagList>
        <ComboBox>
          <Input
            allowBackspace={allowBackspace}
            allowResize={allowResize}
            placeholderText={placeholderText}
          />
          <ListBox>
            {listManager.state.options.length > 0 ? (
              listManager.state.options.map((tag, index) => (
                <Option key={tagToKey(tag)} index={index} />
              ))
            ) : (
              <NoOptions>{noOptionsText}</NoOptions>
            )}
          </ListBox>
        </ComboBox>
        <Announcements selected={listManager.state.selectedTags} />
      </Root>
    </GlobalContext.Provider>
  )
}
