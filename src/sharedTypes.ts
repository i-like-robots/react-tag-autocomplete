export type ClassNames = {
  root: string
  rootActive: string
  selected: string
  selectedItem: string
  selectedTag: string
  selectedTagName: string
  search: string
  searchWrapper: string
  searchInput: string
  suggestions: string
  suggestionsItem: string
  suggestionActive: string
  suggestionDisabled: string
  suggestionPrefix: string
}

export type SelectedTag = {
  value: string | number
  label: string
}

export type SuggestedTag = {
  value: string | number | null
  label: string
  // disabled?: boolean
  skipFilter?: boolean
  // getLabel?: () => string
  // getValue?: () => string | number | null
}
