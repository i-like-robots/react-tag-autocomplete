import React, { useRef } from 'react'
import { KeyNames } from '../constants'
import { GlobalContext } from '../contexts'
import { matchSuggestionsPartial, tagToKey } from '../lib'
import { useManagerTwo, useOnSelect, usePublicAPI } from '../hooks'
import { Announcements, ComboBox, Input, Label, ListBox, Option, Root, Tag, TagList } from '.'
import type { LabelRenderer, OptionRenderer, TagRenderer } from '.'
import type {
  ClassNames,
  OnAdd,
  OnBlur,
  OnCollapse,
  OnDelete,
  OnExpand,
  OnFocus,
  OnInput,
  OnValidate,
  PublicAPI,
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

const DefaultDelimiterKeys = [KeyNames.Enter]

type ReactTagsProps = {
  allowBackspace?: boolean
  allowNew?: boolean
  allowResize?: boolean
  ariaAddedText?: string
  ariaDescribedBy?: string
  ariaErrorMessage?: string
  ariaDeletedText?: string
  classNames?: ClassNames
  closeOnSelect?: boolean
  deleteButtonText?: string
  delimiterKeys?: string[]
  id?: string
  isDisabled?: boolean
  isInvalid?: boolean
  labelText?: string
  newOptionText?: string
  noOptionsText?: string
  onAdd: OnAdd
  onBlur?: OnBlur
  onCollapse?: OnCollapse
  onDelete: OnDelete
  onExpand?: OnExpand
  onFocus?: OnFocus
  onInput?: OnInput
  onValidate?: OnValidate
  placeholderText?: string
  renderLabel?: LabelRenderer
  renderOption?: OptionRenderer
  renderTag?: TagRenderer
  selected: TagSelected[]
  startWithFirstOption?: boolean
  suggestions: TagSuggestion[]
  suggestionsTransform?: SuggestionsTransform
  tagListLabelText?: string
}

function ReactTags(
  {
    allowBackspace = true,
    allowNew = false,
    allowResize = true,
    ariaAddedText = 'Added tag %value%',
    ariaDescribedBy,
    ariaErrorMessage,
    ariaDeletedText = 'Removed tag %value%',
    classNames = DefaultClassNames,
    closeOnSelect = false,
    deleteButtonText = 'Remove %value% from the list',
    delimiterKeys = DefaultDelimiterKeys,
    id = 'react-tags',
    isDisabled = false,
    isInvalid = false,
    labelText = 'Select tags',
    newOptionText = 'Add %value%',
    noOptionsText = 'No options found for %value%',
    onAdd,
    onBlur,
    onCollapse,
    onDelete,
    onExpand,
    onFocus,
    onInput,
    onValidate,
    placeholderText = 'Add a tag',
    renderLabel,
    renderOption,
    renderTag,
    selected = [],
    startWithFirstOption = false,
    suggestions = [],
    suggestionsTransform = matchSuggestionsPartial,
    tagListLabelText = 'Selected tags',
  }: ReactTagsProps,
  ref?: React.ForwardedRef<PublicAPI>
): JSX.Element {
  const comboBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tagListRef = useRef<HTMLUListElement>(null)

  const manager = useManagerTwo({
    allowNew,
    newOptionText,
    noOptionsText,
    onCollapse,
    onExpand,
    onInput,
    onValidate,
    selected,
    startWithFirstOption,
    suggestions,
    suggestionsTransform,
  })

  const onSelect = useOnSelect({ closeOnSelect, manager, onAdd, onDelete })

  const publicAPI = usePublicAPI({ inputRef, manager })

  if (ref) {
    if (typeof ref === 'function') {
      ref(publicAPI)
    } else {
      ref.current = publicAPI
    }
  }

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
      <Root onBlur={onBlur} onFocus={onFocus}>
        <Label render={renderLabel}>{labelText}</Label>
        <TagList label={tagListLabelText}>
          {manager.state.selected.map((tag, index) => (
            <Tag key={tagToKey(tag)} index={index} render={renderTag} title={deleteButtonText} />
          ))}
        </TagList>
        <ComboBox>
          <Input
            allowBackspace={allowBackspace}
            allowResize={allowResize}
            delimiterKeys={delimiterKeys}
            placeholderText={placeholderText}
            ariaDescribedBy={ariaDescribedBy}
            ariaErrorMessage={ariaErrorMessage}
          />
          <ListBox>
            {manager.state.options.map((tag, index) => (
              <Option key={tagToKey(tag)} index={index} render={renderOption} />
            ))}
          </ListBox>
        </ComboBox>
        <Announcements ariaAddedText={ariaAddedText} ariaDeletedText={ariaDeletedText} />
      </Root>
    </GlobalContext.Provider>
  )
}

const ReactTagsWithRef = React.forwardRef(ReactTags)

export { ReactTagsWithRef as ReactTags }

export type { PublicAPI as ReactTagsAPI, ReactTagsProps }
