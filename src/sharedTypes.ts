export type ClassNames = {
  root: string
  rootActive: string
  rootDisabled: string
  hiddenLabel: string
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
}

export type Tag = {
  label: string
  value: string | number | symbol | null
}

export type TagMetaProps = {
  disabled: boolean
  selected: boolean
}

export type TagInternalProps = {
  active: boolean
  index: number
}

export type TagSuggestion = Tag & Partial<TagMetaProps>

export type TagOption = Tag & TagMetaProps & TagInternalProps

export type TagSelected = Tag
