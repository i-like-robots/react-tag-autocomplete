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

export type Tag = {
  label: string
  value: string | number | null
}

export type TagMetaProps = {
  disabled: boolean
  selected: boolean
  skipFilter: boolean
}

export type TagInternalProps = {
  focused: boolean
  index: number
}

export type TagTransformArgs = { inputValue: string } & Omit<TagMetaProps, 'skipFilter'> &
  TagInternalProps

export type TagTransforms = {
  transformLabel: (args: TagTransformArgs) => Tag['label']
  transformValue: (args: TagTransformArgs) => Tag['value']
}

export type TagSuggestion = Tag & Partial<TagMetaProps> & Partial<TagTransforms>

export type TagOption = Tag & Omit<TagMetaProps, 'skipFilter'> & TagInternalProps

export type TagSelected = Tag
