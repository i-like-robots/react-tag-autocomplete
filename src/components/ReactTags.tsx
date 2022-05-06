import React, { useRef } from 'react'
import { matchSuggestionsPartial, tagToKey } from '../lib'
import { GlobalContext } from '../contexts'
import { useInternalOptions, useManager, useOnSelect } from '../hooks'
import { Announcements, ComboBox, Input, Label, ListBox, Option, Root, Tag, TagList } from '.'
import type {
  ClassNames,
  OnAdd,
  OnDelete,
  OnInput,
  OnValidate,
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
  allowTab?: boolean
  ariaAddedText?: string
  ariaDescribedBy?: string
  ariaErrorMessage?: string
  ariaDeletedText?: string
  classNames?: ClassNames
  closeOnSelect?: boolean
  id?: string
  isDisabled?: boolean
  isInvalid?: boolean
  labelText?: string
  newOptionText?: string
  noOptionsText?: string
  onAdd: OnAdd
  onDelete: OnDelete
  onInput?: OnInput
  onValidate?: OnValidate
  placeholderText?: string
  removeButtonText?: string
  selected: TagSelected[]
  suggestions: TagSuggestion[]
  suggestionsTransform?: SuggestionsTransform
  tagListLabelText?: string
}

export function ReactTags({
  allowBackspace = true,
  allowNew = false,
  allowResize = true,
  allowTab = false,
  ariaAddedText = 'Added tag %value%',
  ariaDescribedBy,
  ariaErrorMessage,
  ariaDeletedText = 'Removed tag %value%',
  classNames = DefaultClassNames,
  closeOnSelect = false,
  id = 'react-tags',
  isDisabled = false,
  isInvalid = false,
  labelText = 'Select tags',
  newOptionText = 'Add %value%',
  noOptionsText = 'No options found for %value%',
  onAdd,
  onDelete,
  onInput,
  onValidate,
  placeholderText = 'Add a tag',
  removeButtonText = 'Remove %value% from the list',
  selected = [],
  suggestions = [],
  suggestionsTransform = matchSuggestionsPartial,
  tagListLabelText = 'Selected tags',
}: ReactTagsProps): JSX.Element {
  const comboBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tagListRef = useRef<HTMLUListElement>(null)

  const { newTagOption, noTagsOption } = useInternalOptions({
    newOptionText,
    noOptionsText,
    onValidate,
  })

  const manager = useManager({
    activeIndex: -1,
    activeOption: null,
    allowNew,
    isExpanded: false,
    newTagOption,
    noTagsOption,
    options: [],
    selected,
    suggestions,
    suggestionsTransform,
    value: '',
  })

  const onSelect = useOnSelect({ closeOnSelect, manager, onAdd, onDelete })

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
            allowTab={allowTab}
            placeholderText={placeholderText}
            ariaDescribedBy={ariaDescribedBy}
            ariaErrorMessage={ariaErrorMessage}
          />
          <ListBox>
            {manager.state.options.map((tag, index) => (
              <Option key={tagToKey(tag)} index={index} />
            ))}
          </ListBox>
        </ComboBox>
        <Announcements ariaAddedText={ariaAddedText} ariaDeletedText={ariaDeletedText} />
      </Root>
    </GlobalContext.Provider>
  )
}
