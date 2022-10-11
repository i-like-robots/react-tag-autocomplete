import React, { useRef } from 'react'
import { matchSuggestionsPartial, tagToKey } from '../lib'
import { GlobalContext } from '../contexts'
import { useInternalOptions, useManager, useOnSelect, usePublicAPI } from '../hooks'
import { Announcements, ComboBox, Input, Label, ListBox, Option, Root, Tag, TagList } from '.'
import type { LabelRenderer, OptionRenderer, TagRenderer } from '.'
import type {
  ClassNames,
  OnAdd,
  OnDelete,
  OnInput,
  OnValidate,
  PublicAPI,
  SuggestionsTransform,
  TagSelected,
  TagSuggestion,
  Tag as TagType,
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

type ReactTagsProps<T extends TagType> = {
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
  deleteButtonText?: string
  id?: string
  isDisabled?: boolean
  isInvalid?: boolean
  labelText?: string
  newOptionText?: string
  noOptionsText?: string
  onAdd: OnAdd<T>
  onDelete: OnDelete
  onInput?: OnInput
  onValidate?: OnValidate
  placeholderText?: string
  renderLabel?: LabelRenderer
  renderOption?: OptionRenderer<T>
  renderTag?: TagRenderer<T>
  selected: TagSelected<T>[]
  suggestions: TagSuggestion<T>[]
  suggestionsTransform?: SuggestionsTransform<T>
  tagListLabelText?: string
}

function ReactTags<T extends TagType>(
  {
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
    deleteButtonText = 'Remove %value% from the list',
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
    renderLabel,
    renderOption,
    renderTag,
    selected = [],
    suggestions = [],
    suggestionsTransform = matchSuggestionsPartial,
    tagListLabelText = 'Selected tags',
  }: ReactTagsProps<T>,
  ref?: React.MutableRefObject<PublicAPI<T>>
): JSX.Element {
  const comboBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tagListRef = useRef<HTMLUListElement>(null)

  const { newTagOption, noTagsOption } = useInternalOptions<T>({
    newOptionText,
    noOptionsText,
    onValidate,
  })

  const manager = useManager<T>({
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

  const onSelect = useOnSelect<T>({ closeOnSelect, manager, onAdd, onDelete })

  const publicAPI = usePublicAPI<T>({ inputRef, manager })

  if (ref) {
    ref.current ??= publicAPI
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
        onInput,
        onSelect,
        rootRef,
        tagListRef,
      }}
    >
      <Root>
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
            allowTab={allowTab}
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
