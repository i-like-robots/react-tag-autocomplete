# Migration Guide from v6 to v7

Version 7 is a complete rewrite of the `react-tag-autocomplete` package, begun from scratch with the aims of hugely improving accessibility and embracing a modern toolchain. Many changes have also been made in an effort to improve clarity and consistency across the code base for both contributors and implementors.

## Prerequisites

This version is for use with React v18 and above _only_. If you are using an older version of React please continue to use [the previous version of this component](https://github.com/i-like-robots/react-tags) which will remain supported for at least 12 months.

## Prop name changes

The following props have been renamed in v7:

| v6 prop name          | v7 prop name       | Notes                                                   |
| --------------------- | ------------------ | ------------------------------------------------------- |
| `autoresize`          | `allowResize`      |                                                         |
| `delimiters`          | `delimiterKeys`    |                                                         |
| `noSuggestionsText`   | `noOptionsText`    |                                                         |
| `onAddition`          | `onAdd`            |                                                         |
| `removeButtonText`    | `deleteButtonText` |                                                         |
| `suggestionComponent` | `renderOption`     | Refer to [render props](#changes-to-render-props) below |
| `tags`                | `selected`         | Refer to [tag props](#changes-to-tags) below            |
| `tagComponent`        | `renderTag`        | Refer to [render props](#changes-to-render-props) below |

## Prop removals

The following props have been removed from v7:

| v6 prop name           | v7 alternative                                       |
| ---------------------- | ---------------------------------------------------- |
| `addOnBlur`            | None but can be implemented manually                 |
| `inputAttributes`      | Use `renderInput` prop to provide a custom component |
| `maxSuggestionsLength` | Use `suggestionsTransform` prop instead              |
| `minQueryLength`       | Use `onShouldExpand` prop instead                    |
| `suggestionsFilter`    | Use `suggestionsTransform` prop instead              |

## Changes to tags

The structure of suggested and selected tags has been updated. The `id` property has been renamed `value` and the `name` property has been renamed `label`. This change was made for consistency with the [`HTMLOptionElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOptionElement) interface used by native listbox components.

```diff
- { id: 1, name: "Apples" }
+ { value: 1, label: "Apples" }
```

## Changes to render props

All render props (used to provide custom components) now receive the `classNames` object and a collection of required props. Some render props now also receive children. Please refer to [the readme](readme.md#props) for more details and examples on how to use each render prop.

## Class name and styling changes

There are a number changes to the HTML structure of the component and some property names have also been changed. The component supports more states and more sub-components have class names applied to them than before. This results in less stylesheet specificity and better support for using tools such as [`@emotion/css`](https://emotion.sh/docs/@emotion/css).

Please refer to the [new example styles](example/src/styles.css) for more details.

| v6 property name     | v7 property name | Notes                                      |
| -------------------- | ---------------- | ------------------------------------------ |
| `root`               | `root`           |                                            |
| `rootFocused`        | `rootIsActive`   |                                            |
| -                    | `rootIsDisabled` | New state                                  |
| -                    | `rootIsInvalid`  | New state                                  |
| -                    | `label`          | New sub-component                          |
| `selected`           | `tagList`        |                                            |
| -                    | `tagListItem`    | Added class name for tag list items        |
| `selectedTag`        | `tag`            |                                            |
| `selectedTagName`    | `tagName`        |                                            |
| `search`             | `comboBox`       |                                            |
| `searchWrapper`      | -                | Removed component                          |
| `searchInput`        | `input`          |                                            |
| `suggestions`        | `listBox`        |                                            |
| -                    | `option`         | Added class name for list box options      |
| `suggestionActive`   | `optionIsActive` |                                            |
| `suggestionDisabled` | -                | Removed class name, use attribute selector |
| `suggestionPrefix`   | -                | Removed component                          |
| -                    | `highlight`      | New sub-component                          |
