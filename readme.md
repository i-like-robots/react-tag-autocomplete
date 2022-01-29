# React Tag Autocomplete

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/i-like-robots/react-tag-autocomplete/blob/master/LICENSE) ![build status](https://github.com/i-like-robots/react-tag-autocomplete/actions/workflows/test.yml/badge.svg?branch=main) [![Coverage Status](https://coveralls.io/repos/github/i-like-robots/react-tag-autocomplete/badge.svg?branch=master)](https://coveralls.io/github/i-like-robots/react-tag-autocomplete) [![npm version](https://img.shields.io/npm/v/react-tag-autocomplete.svg?style=flat)](https://www.npmjs.com/package/react-tag-autocomplete)

React Tag Autocomplete is a simple, accessible, tagging component ready to drop into your React projects. [View example](http://i-like-robots.github.io/react-tag-autocomplete/).

<center>
  <img width="765" alt="Screenshot showing React Tag Autocomplete used as a country selector" src="https://user-images.githubusercontent.com/271645/150850388-d75bba59-0642-4722-a56f-6c8ae22c9814.png">
</center>

_Please note:_ This repository is for version 7 of the component which is under development. To view the current stable version of React Tag Autocomplete see the [old repository](https://github.com/i-like-robots/react-tags).

## Installation

This is a [Node.js] module available through the [npm] registry. Node 16 and React 17 or above is required.

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

  const onDelete = useCallback(
    (index) => {
      setSelected(selected.filter((_, i) => i !== index))
      return true
    },
    [selected]
  )

  const onAddition = useCallback(
    (newTag) => {
      setSelected([...selected, newTag])
      return true
    },
    [selected]
  )

  return (
    <ReactTags
      labelText="Select countries"
      selected={selected}
      suggestions={suggestions}
      onDelete={onDelete}
      onAddition={onAddition}
      noSuggestionsText="No matching countries"
    />
  )
}
```

### Options

- [`allowBackspace`](#allowBackspace-optional)
- [`allowNew`](#allowNew-optional)
- [`allowResize`](#allowResize-optional)
- [`classNames`](#classNames-optional)
- [`closeOnSelect`](#closeOnSelect-optional)
- [`id`](#id-optional)
- [`isDisabled`](#isDisabled-optional)
- [`isInvalid`](#isInvalid-optional)
- [`labelText`](#labelText-optional)
- [`newTagText`](#newTagText-optional)
- [`noSuggestionsText`](#noSuggestionsText-optional)
- [`onAddition`](#onaddition-required)
- [`onDelete`](#ondelete-required)
- [`onInput`](#oninput-optional)
- [`onValidate`](#onValidate-optional)
- [`placeholderText`](#placeholderText-optional)
- [`removeButtonText`](#removeButtontext-optional)
- [`selected`](#selected-optional)
- [`suggestions`](#suggestions-optional)
- [`suggestionsTransform`](#suggestionsTransform-optional)

#### allowBackspace (optional)

Enable users to delete selected tags when the backspace key is pressed whilst the text input is empty. Defaults to `true`.

#### allowNew (optional)

Enable users to add new (not suggested) tags based on the input text. Defaults to `false`.

#### allowResize (optional)

Boolean parameter to control whether the text input should be automatically resized to fit its value. Defaults to `true`.

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

Boolean parameter to control whether the listbox should be closed and active option reset when a tag is selected. Defaults to `false`.

#### id (optional)

The ID attribute given to the listbox element. This should be unique for each component instance. Defaults to: `"ReactTags"`.

#### isDisabled (optional)

Disables all interactive elements of the component. Defaults to: `false`.

#### isInvalid (optional)

Marks the input as invalid. Defaults to: `false`.
#### labelText (optional)

The label text used to describe the component and input. Defaults to: `"Select tags"`.

#### newTagText (optional)

The option text shown when the `allowNew` option is enabled. The placeholder `%value%` will be replaced by the current input value. Defaults to `"Add %value%"`.

#### noSuggestionsText (optional)

The option text shown when there are no matching suggestions. Defaults to `"No options found"`.

#### onAddition (required)

Callback function called when the user attempts to select a tag. Receives the tag. Example:

```js
const [selected, setSelected] = useState([])

function onAddition(newTag) {
  setSelected([...selected, newTag])
}
```

#### onDelete (required)

Callback function called when the user wants to remove a selected tag. Receives the index of the selected tag. Example:

```js
const [selected, setSelected] = useState([])

function onDelete(tagIndex) {
  setSelected(selected.filter((_, i) => i !== tagIndex))
}
```

#### onInput (optional)

Optional callback function called each time the input value changes. Receives the new input value. Example:

```js
const [value, setValue] = useState('')

function onInput(value) {
  setValue(value)
}
```

#### onValidate (optional)

Optional callback function that determines if a tag should be added. Receives the tag object and must return a boolean. Example:

```js
function onValidate(tag) {
  return tag.label.length >= 5;
}
```

#### placeholderText (optional)

The placeholder text shown in the input when it is empty. Defaults to `"Add a tag"`.

#### removeButtonText (optional)

The helper text added to each selected tag. The placeholder `%label%` will be replaced by the selected tag label. Default `"Remove %label% from the list"`.

#### selected (optional)

An array of selected tags. Each tag is an object which must have a `value` and a `label` property. Defaults to `[]`.

```js
const tags = [
  { value: 1, label: 'Apples' },
  { value: 2, label: 'Pears' },
]
```

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

#### suggestionsTransform (optional)

Callback function to apply a custom filter to the list of suggestions. The callback receives two arguments; the current input `value` and the array of [suggestions](#suggestions-optional) and must return a new array of suggestions. Using this option you can also sort suggestions. Example:

```js
import matchSorter from 'match-sorter'

function suggestionsFilter(value, suggestions) {
  return matchSorter(suggestions, value, { keys: ['label'] })
}
```

## API

### `.method(args)`

Returns something.

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
