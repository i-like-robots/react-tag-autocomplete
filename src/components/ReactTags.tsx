import React, { useRef } from 'react'
import { matchSuggestionsPartial, tagToKey } from '../lib'
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
import type {
  ClassNames,
  OnAddition,
  OnDelete,
  OnInput,
  SuggestionsTransform,
  TagSelected,
  TagSuggestion,
} from '../sharedTypes'

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
  closeOnSelect?: boolean
  id?: string
  isDisabled?: boolean
  isInvalid?: boolean
  labelText?: string
  newTagText?: string
  noSuggestionsText?: string
  tagListLabelText?: string
  onAddition: OnAddition
  onDelete: OnDelete
  onInput?: OnInput
  placeholderText?: string
  removeButtonText?: string
  selected: TagSelected[]
  suggestions: TagSuggestion[]
  suggestionsTransform?: SuggestionsTransform
}

export function ReactTags({
  allowBackspace = true,
  allowNew = false,
  allowResize = true,
  classNames = DefaultClassNames,
  closeOnSelect = false,
  id = 'react-tags',
  isDisabled = false,
  isInvalid = false,
  labelText = 'Select tags',
  newTagText = 'Add %value%',
  noSuggestionsText = 'No options found',
  tagListLabelText = 'Selected tags',
  onAddition,
  onDelete,
  onInput,
  placeholderText = 'Add a tag',
  removeButtonText = 'Remove %label% from the list',
  selected = [],
  suggestions = [],
  suggestionsTransform = matchSuggestionsPartial,
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
    isExpanded: false,
    newTagText,
    options: [],
    selected,
    suggestions,
    suggestionsTransform,
    value: '',
  })

  const onSelect = useOnSelect({ closeOnSelect, manager, onAddition, onDelete })

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
        onInput,
        onSelect,
        rootRef,
        tagListRef,
      }}
    >
      <Root>
        <Label>{labelText}</Label>
        <TagList label={tagListLabelText}>
          {manager.state.selected.map((tag, index) => (
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
              // TODO: refactor into manager
              <NoOptions>{noSuggestionsText}</NoOptions>
            )}
          </ListBox>
        </ComboBox>
        <Announcements selected={manager.state.selected} />
      </Root>
    </GlobalContext.Provider>
  )
}
