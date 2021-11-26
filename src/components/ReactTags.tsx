import React, { useRef } from 'react'
import {
  useActive,
  useKeepFocus,
  useListBox,
  useListManager,
  useOptions,
  useSuggestions,
  useTagActions,
} from '../hooks'
import { Input, ListBox, Option, TagList } from '.'
import type { ClassNames, SelectedTag, SuggestedTag } from '../sharedTypes'

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
  onAddition: (tag: SuggestedTag) => void
  onDelete: (index: number) => void
  onValidate: (value: string) => boolean
  placeholderText?: string
  removeButtonText?: string
  suggestions: SuggestedTag[]
  tags: SelectedTag[]
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
  onValidate,
  placeholderText = 'Add a tag',
  removeButtonText = 'Remove %label% from the list',
  suggestions = [],
  tags = [],
}: ReactTagsProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLInputElement>()

  useKeepFocus({ containerRef, tags })

  const listManager = useListManager({
    results: [],
    suggestions: useSuggestions({ allowNew, newTagText, suggestions }),
    selectedIndex: -1,
    selectedTag: null,
    value: '',
  })

  const { containerProps, isActive } = useActive({ containerRef, inputRef })

  const { createNewTag, selectMatchingTag, selectTag } = useTagActions(listManager, {
    allowNew,
    onAddition,
    onValidate,
  })

  const { inputProps, isExpanded, listBoxProps } = useListBox(listManager, {
    createNewTag,
    id,
    selectMatchingTag,
    selectTag,
  })

  const options = useOptions(listManager, { id, onAddition })

  const classes = [classNames.root]

  if (isActive) classes.push(classNames.rootActive)

  return (
    <div className={classes.join(' ')} {...containerProps}>
      <TagList
        classNames={classNames}
        onDelete={onDelete}
        removeButtonText={removeButtonText}
        tags={tags}
        tagListTitleText={tagListTitleText}
      />
      <div className={classNames.search}>
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
            {options.map((option) => {
              if (allowNew && option.label === newTagText) {
                // TODO: move all option transforms into useOptions hook
                const label = newTagText.replace('%value%', listManager.value)
                return <Option classNames={classNames} key={label} {...option} label={label} />
              } else {
                return <Option classNames={classNames} key={option.label} {...option} />
              }
            })}
          </ListBox>
        ) : null}
      </div>
    </div>
  )
}
