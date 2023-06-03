import React, { useRef } from 'react'
import { KeyNames } from '../constants'
import { GlobalContext } from '../contexts'
import { matchTagsPartial, tagToKey } from '../lib'
import { useManager, usePublicAPI } from '../hooks'
import {
  Announcements,
  ComboBox,
  Highlight,
  Input,
  Label,
  ListBox,
  Option,
  Root,
  Tag,
  TagList,
} from '.'
import type {
  HighlightRenderer,
  InputRenderer,
  LabelRenderer,
  OptionRenderer,
  RootRenderer,
  TagRenderer,
} from '.'
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
  option: 'react-tags__listbox-option',
  optionIsActive: 'is-active',
  highlight: 'react-tags__listbox-option-highlight',
}

const DefaultDelimiterKeys = [KeyNames.Enter]

type ReactTagsProps = {
  activateFirstOption?: boolean
  allowBackspace?: boolean
  allowNew?: boolean
  allowResize?: boolean
  ariaAddedText?: string
  ariaDescribedBy?: string
  ariaErrorMessage?: string
  ariaDeletedText?: string
  classNames?: ClassNames
  collapseOnSelect?: boolean
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
  onCollapse?: OnCollapse // TODO: rename onListBoxCollapse
  onDelete: OnDelete
  onExpand?: OnExpand // TODO: rename onListBoxExpand
  onFocus?: OnFocus
  onInput?: OnInput // TODO: rename onInputChange
  onValidate?: OnValidate // TODO: rename onInputValidate
  placeholderText?: string
  renderHighlight?: HighlightRenderer
  renderInput?: InputRenderer
  renderLabel?: LabelRenderer
  renderOption?: OptionRenderer
  renderRoot?: RootRenderer
  renderTag?: TagRenderer
  selected: TagSelected[]
  suggestions: TagSuggestion[]
  suggestionsTransform?: SuggestionsTransform
  tagListLabelText?: string
}

function ReactTags(
  {
    activateFirstOption = false,
    allowBackspace = true,
    allowNew = false,
    allowResize = true,
    ariaAddedText = 'Added tag %value%',
    ariaDescribedBy,
    ariaErrorMessage,
    ariaDeletedText = 'Removed tag %value%',
    classNames = DefaultClassNames,
    collapseOnSelect = false,
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
    renderHighlight,
    renderInput,
    renderLabel,
    renderOption,
    renderRoot,
    renderTag,
    selected = [],
    suggestions = [],
    suggestionsTransform = matchTagsPartial,
    tagListLabelText = 'Selected tags',
  }: ReactTagsProps,
  ref?: React.ForwardedRef<PublicAPI>
): JSX.Element {
  const comboBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLDivElement>(null)

  const managerRef = useManager({
    activateFirstOption,
    allowNew,
    collapseOnSelect,
    newOptionText,
    noOptionsText,
    onAdd,
    onDelete,
    onCollapse,
    onExpand,
    onInput,
    onValidate,
    selected,
    suggestions,
    suggestionsTransform,
  })

  const publicAPI = usePublicAPI({ inputRef, managerRef })

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
        managerRef,
      }}
    >
      <Root onBlur={onBlur} onFocus={onFocus} render={renderRoot}>
        <Label render={renderLabel}>{labelText}</Label>
        <TagList label={tagListLabelText}>
          {managerRef.current.state.selected.map((tag, index) => (
            <Tag key={tagToKey(tag)} index={index} render={renderTag} title={deleteButtonText} />
          ))}
        </TagList>
        <ComboBox>
          <Input
            allowBackspace={allowBackspace}
            allowResize={allowResize}
            ariaDescribedBy={ariaDescribedBy}
            ariaErrorMessage={ariaErrorMessage}
            delimiterKeys={delimiterKeys}
            placeholderText={placeholderText}
            render={renderInput}
          />
          <ListBox>
            {managerRef.current.state.options.map((option, index) => (
              <Option key={tagToKey(option)} index={index} render={renderOption}>
                <Highlight
                  option={option}
                  query={managerRef.current.state.value}
                  render={renderHighlight}
                />
              </Option>
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
