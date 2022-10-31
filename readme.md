# React Tag Autocomplete

[![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/i-like-robots/react-tag-autocomplete/blob/master/LICENSE) ![build status](https://github.com/i-like-robots/react-tag-autocomplete/actions/workflows/test.yml/badge.svg?branch=main) [![Coverage Status](https://coveralls.io/repos/github/i-like-robots/react-tag-autocomplete/badge.svg?branch=main)](https://coveralls.io/github/i-like-robots/react-tag-autocomplete) [![npm version](https://img.shields.io/npm/v/react-tag-autocomplete/beta.svg?style=flat)](https://www.npmjs.com/package/react-tag-autocomplete)

React Tag Autocomplete is a simple, accessible, tagging component ready to drop into your React projects. [Try the examples here](http://i-like-robots.github.io/react-tag-autocomplete/).

<p align="center">
  <img width="765" alt="Screenshot showing React Tag Autocomplete used as a country selector" src="https://user-images.githubusercontent.com/271645/150850388-d75bba59-0642-4722-a56f-6c8ae22c9814.png">
</p>

_Please note:_ This repository is for version 7 of the component which is under development. To view the current stable version of React Tag Autocomplete see the [old repository](https://github.com/i-like-robots/react-tags).

## Installation

This is a [Node.js] module available through the [npm] registry. Node 16 and React 18 or above are required.

Installation is done using the [npm install] command:

```sh
$ npm install -S react-tag-autocomplete@beta
```

[node.js]: https://nodejs.org/
[npm]: http://npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally

## Usage

```js
import React, { useCallback, useState } from 'react'
import { ReactTags } from 'react-tag-autocomplete'
import { suggestions } from './country-list'

function CountrySelector() {
  const [selected, setSelected] = useState([])

  const onAdd = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
    },
    [selected]
  )

  const onDelete = useCallback(
    (tagIndex) => {
      setSelected(selected.filter((_, i) => i !== tagIndex))
    },
    [selected]
  )

  return (
    <ReactTags
      labelText="Select countries"
      selected={selected}
      suggestions={suggestions}
      onAdd={onAdd}
      onDelete={onDelete}
      noOptionsText="No matching countries"
    />
  )
}
```

### Props

- [`allowBackspace`](#allowBackspace-optional)
- [`allowNew`](#allowNew-optional)
- [`allowResize`](#allowResize-optional)
- [`ariaAddedText`](#ariaAddedText-optional)
- [`ariaDeletedText`](#ariaDeletedText-optional)
- [`ariaDescribedBy`](#ariaDescribedBy-optional)
- [`ariaErrorMessage`](#ariaErrorMessage-optional)
- [`classNames`](#classNames-optional)
- [`closeOnSelect`](#closeOnSelect-optional)
- [`deleteButtonText`](#deleteButtontext-optional)
- [`delimiterKeys`](#delimiterKeys-optional)
- [`id`](#id-optional)
- [`isDisabled`](#isDisabled-optional)
- [`isInvalid`](#isInvalid-optional)
- [`labelText`](#labelText-optional)
- [`newOptionText`](#newOptionText-optional)
- [`noOptionsText`](#noOptionsText-optional)
- [`onAdd`](#onAdd-required)
- [`onBlur`](#onBlur-optional)
- [`onCollapse`](#onCollapse-optional)
- [`onDelete`](#ondelete-required)
- [`onExpand`](#onExpand-optional)
- [`onFocus`](#onFocus-optional)
- [`onInput`](#oninput-optional)
- [`onValidate`](#onValidate-optional)
- [`placeholderText`](#placeholderText-optional)
- [`renderLabel`](#renderLabel-optional)
- [`renderOption`](#renderOption-optional)
- [`renderTag`](#renderTag-optional)
- [`selected`](#selected-optional)
- [`startWithFirstOption`](#startWithFirstOption-optional)
- [`suggestions`](#suggestions-optional)
- [`suggestionsTransform`](#suggestionsTransform-optional)
- [`tagListLabelText`](#tagListLabelText-optional)

#### allowBackspace (optional)

Enable users to delete selected tags when the backspace key is pressed whilst the text input is empty. Defaults to `true`.

#### allowNew (optional)

Enable users to add new (not suggested) tags based on the input text. The new tag label and value will be set as the input text. Defaults to `false`.

#### allowResize (optional)

Enable the text input to automatically resize to fit its value. Defaults to `true`.

#### ariaAddedText (optional)

The status text announced when a selected tag is added. The placeholder `%value%` will be replaced by the selected tag label. Defaults to `"Added tag %value%"`.

#### ariaDeletedText (optional)

The status text announced when a selected tag is removed. The placeholder `%value%` will be replaced by the removed tag label. Defaults to `"Removed tag %value%"`.

#### ariaDescribedBy (optional)

References elements by ID which contain more information about the component. Defaults to `""`.

#### ariaErrorMessage (optional)

References an element by ID which contains more information about errors relating to the component. Defaults to `""`.

#### classNames (optional)

Override the default class names used by the component. Defaults to:

```js
{
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
```

#### closeOnSelect (optional)

Controls whether the listbox should be collapsed and active option reset when a tag is selected. Defaults to `false`.

#### deleteButtonText (optional)

The helper text added to each selected tag. The placeholder `%value%` will be replaced by the selected tag label. Defaults to `"Remove %value% from the list"`.

#### delimiterKeys (optional)

Array of key names matching [`KeyboardEvent` key values](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key). When a matching key is pressed it will trigger tag selection. Defaults to `['Enter']`.

#### id (optional)

The ID attribute given to the component and used as a prefix for all sub-component IDs. This must be unique for each instance of the component. Defaults to: `"ReactTags"`.

#### isDisabled (optional)

Disables all interactive elements of the component. Defaults to: `false`.

#### isInvalid (optional)

Marks the input as invalid. When true this should be used along with the `ariaErrorMessage` prop to provide details about the problem. Defaults to: `false`.

#### labelText (optional)

The label text used to describe the component and input. _Please note_ that the label is visually hidden with CSS in the example code. Defaults to: `"Select tags"`.

#### newOptionText (optional)

The option text shown when the `allowNew` prop is enabled. The placeholder `%value%` will be replaced by the current input value. Defaults to `"Add %value%"`.

#### noOptionsText (optional)

The option text shown when there are no matching suggestions. The placeholder `%value%` will be replaced by the current input value. Defaults to `"No options found for %value%"`.

#### onAdd (required)

Callback function called when the user wants to select a tag. Receives the tag. Example:

```js
const [selected, setSelected] = useState([])

function onAdd(newTag) {
  setSelected([...selected, newTag])
}
```

#### onBlur (optional)

Callback function called when the component loses focus. Receives no arguments.

#### onCollapse (optional)

Callback function called when the listbox collapses. Receives no arguments.

#### onDelete (required)

Callback function called when the user wants to remove a selected tag. Receives the index of the selected tag. Example:

```js
const [selected, setSelected] = useState([])

function onDelete(tagIndex) {
  setSelected(selected.filter((_, i) => i !== tagIndex))
}
```

#### onExpand (optional)

Callback function called when the listbox expands. Receives no arguments.

#### onFocus (optional)

Callback function called when the component gains focus. Receives no arguments.

#### onInput (optional)

Optional callback function called each time the input value changes. Receives the new input value. Example:

```js
const [value, setValue] = useState('')

function onInput(value) {
  setValue(value)
}
```

#### onValidate (optional)

Callback function called when the input value changes and is used to enable or disable the new option when the `allowNew` prop is true. Receives the new input value and should return a boolean. Example:

```js
function onValidate(value) {
  return /^[a-z]{4,12}$/i.test(value)
}
```

#### placeholderText (optional)

The placeholder text shown in the input when it is empty. Defaults to `"Add a tag"`.

#### renderLabel (optional)

A custom label component to render. Receives the label text as children, required label element attributes, and [`classNames`](#classNames-optional) as props. Defaults to `null`.


```js
function CustomLabel({ children, classNames, ...labelProps }) {
  return (
    <div className={classNames.label} {...labelProps}>
      {children}
    </div>
  )
}
```

#### renderOption (optional)

A custom option component to render. Receives the pre-rendered text as children, option object, required option element attributes, and [`classNames`](#classNames-optional) as props. Defaults to `null`.

```js
function CustomOption({ children, classNames, option, ...optionProps }) {
  const classes = [
    classNames.option,
    option.active ? 'is-active' : '',
    option.selected ? 'is-selected' : ''
  ]

  return (
    <div className={classes.join(' ')} {...optionProps}>
      {children}
    </div>
  )
}
```

#### renderTag (optional)

A custom selected tag component to render. Receives the selected tag object, required tag element attributes, and [`classNames`](#classNames-optional) as props. Defaults to `null`.

```js
function CustomTag({ classNames, tag, ...tagProps }) {
  return (
    <button type="button" className={classNames.tag} {...tagProps}>
      <span className={classNames.tagName}>{tag.label}</span>
    </button>
  )
}
```

#### selected (optional)

An array of selected tags. Each tag is an object which must have a `value` and a `label` property. Defaults to `[]`.

```js
const tags = [
  { value: 1, label: 'Apples' },
  { value: 2, label: 'Pears' },
]
```

For TypeScript users the `TagSelected` type can be extended with additional properties:

```ts
import type { TagSelected } from 'react-tag-autocomplete'
type CustomTagSelected = TagSelected & { myProperty: string }
const [selected, setSelected] = useState<CustomTagSelected[]>([])
```

#### startWithFirstOption (optional)

Automatically activate the first option when the listbox is expanded and switch the active option directly from first to last/last to first when the selection wraps. Defaults to `false`.

#### suggestions (optional)

An array of tags for the user select. Each suggestion is an object which must have a `value` and a `label` property. Suggestions may also specify a `disabled` property to make the suggestion non-selectable. Defaults to `[]`.

```js
const suggestions = [
  { value: 3, label: 'Bananas' },
  { value: 4, label: 'Mangos' },
  { value: 5, label: 'Lemons' },
  { value: 6, label: 'Apricots', disabled: true },
]
```

For TypeScript users the `TagSuggestion` type can be extended with additional properties:

```ts
import type { TagSuggestion } from 'react-tag-autocomplete'
type CustomTagSuggestion = TagSuggestion & { myProperty: string }
const suggestions: CustomTagSuggestion[] = []
```

#### suggestionsTransform (optional)

Callback function to apply a custom filter to the list of suggestions. The callback receives two arguments; the current input `value` and the array of [suggestions](#suggestions-optional) and must return a new array of suggestions. Using this prop you could sort suggestions or change the number of suggestions. Example:

```js
import matchSorter from 'match-sorter'

function suggestionsTransform(value, suggestions) {
  return matchSorter(suggestions, value, { keys: ['label'] })
}
```

#### tagListLabelText (optional)

The ARIA label text added to the selected tags list. Defaults to `"Selected tags"`.

## Development

This project is written using [TypeScript], [Prettier] for code formatting, [ESLint] for static analysis, and is tested with [Vitest] and [Testing Library].

[typescript]: https://www.typescriptlang.org/
[prettier]: https://prettier.io/
[eslint]: https://eslint.org/
[vitest]: https://vitest.dev/
[testing library]: https://testing-library.com/

## License

This project is [ISC] licensed. You are free to modify and distribute this code in private or commercial projects but the license and copyright notice must remain.

[isc]: https://en.wikipedia.org/wiki/ISC_license
