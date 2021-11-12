export type ClassNames = {
  root: string
  rootActive: string
  selected: string
  selectedTag: string
  selectedTagName: string
  search: string
  searchWrapper: string
  searchInput: string
  suggestions: string
  suggestionActive: string
  suggestionDisabled: string
  suggestionPrefix: string
}

export type SelectedTag = {
  value: string | number
  label: string
}

export type SuggestedTag = {
  value: string | number
  label: string
}
