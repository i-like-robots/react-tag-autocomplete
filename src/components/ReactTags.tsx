import React, { useRef } from 'react'
import { matchSuggestionsPartial, tagToKey } from '../lib'
import { GlobalContext } from '../contexts'
import { useInternalOptions, useManager, useOnSelect } from '../hooks'
import { Announcements, ComboBox, Input, Label, ListBox, Option, Root, Tag, TagList } from '.'
import type {
  ClassNames,
  OnAddition,
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
  ariaRemovedText?: string
  classNames?: ClassNames
  closeOnSelect?: boolean
  id?: string
  isDisabled?: boolean
  isInvalid?: boolean
  labelText?: string
  newTagText?: string
  noOptionsText?: string
  tagListLabelText?: string
  onAddition: OnAddition
  onDelete: OnDelete
  onInput?: OnInput
  onValidate?: OnValidate
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
  allowTab = false,
  ariaAddedText = 'Added tag %value%',
  ariaDescribedBy,
  ariaErrorMessage,
  ariaRemovedText = 'Removed tag %value%',
  classNames = DefaultClassNames,
  closeOnSelect = false,
  id = 'react-tags',
  isDisabled = false,
  isInvalid = false,
  labelText = 'Select tags',
  newTagText = 'Add %value%',
  noOptionsText = 'No options found for %value%',
  tagListLabelText = 'Selected tags',
  onAddition,
  onDelete,
  onInput,
  onValidate,
  placeholderText = 'Add a tag',
  removeButtonText = 'Remove %value% from the list',
  selected = [],
  suggestions = [],
  suggestionsTransform = matchSuggestionsPartial,
}: ReactTagsProps): JSX.Element {
  const comboBoxRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()
  const listBoxRef = useRef<HTMLDivElement>()
  const rootRef = useRef<HTMLDivElement>()
  const tagListRef = useRef<HTMLUListElement>()

  const { newTagOption, noTagsOption } = useInternalOptions({ onValidate })

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
        // todo: move it
        newTagText,
        noOptionsText,
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
        <Announcements ariaAddedText={ariaAddedText} ariaRemovedText={ariaRemovedText} />
      </Root>
    </GlobalContext.Provider>
  )
}
