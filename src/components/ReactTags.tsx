import React, { useRef } from 'react'
import { tagToKey } from '../lib'
import { GlobalContext } from '../contexts'
import { useManager, useOnSelect } from '../hooks'
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
  classNames?: ClassNames
  id?: string
  isDisabled?: boolean
  isInvalid?: boolean
  labelText?: string
  noOptionsText?: string
  newTagText?: string
  tagListLabelText?: string
  onAddition: OnAddition
  onDelete: OnDelete
  placeholderText?: string
  removeButtonText?: string
  selected: TagSelected[]
  suggestions: TagSuggestion[]
}

export function ReactTags({
  allowBackspace = true,
  allowNew = false,
  allowResize = true,
  classNames = DefaultClassNames,
  id = 'react-tags',
  isDisabled = false,
  isInvalid = false,
  labelText = 'Select tags',
  noOptionsText = 'No options found',
  newTagText = 'Add %value%',
  tagListLabelText = 'Selected tags',
  onAddition,
  onDelete,
  placeholderText = 'Add a tag',
  removeButtonText = 'Remove %label% from the list',
  selected = [],
  suggestions = [],
}: ReactTagsProps): JSX.Element {
  const comboBoxRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()
  const listBoxRef = useRef<HTMLDivElement>()
  const rootRef = useRef<HTMLDivElement>()
  const tagListRef = useRef<HTMLUListElement>()

  const manager = useManager({
    activeIndex: -1,
    activeOption: null,
    allowNew,
    newTagText,
    options: [],
    selectedKeys: null,
    selectedTags: selected,
    suggestions,
    value: '',
  })

  const onSelect = useOnSelect({ manager, onAddition, onDelete })

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
        manager,
        onSelect,
        rootRef,
        tagListRef,
      }}
    >
      <Root>
        <Label>{labelText}</Label>
        <TagList label={tagListLabelText}>
          {manager.state.selectedTags.map((tag, index) => (
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
            {manager.state.options.length > 0 ? (
              manager.state.options.map((tag, index) => (
                <Option key={tagToKey(tag)} index={index} />
              ))
            ) : (
              <NoOptions>{noOptionsText}</NoOptions>
            )}
          </ListBox>
        </ComboBox>
        <Announcements selected={manager.state.selectedTags} />
      </Root>
    </GlobalContext.Provider>
  )
}
