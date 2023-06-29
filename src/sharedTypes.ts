export type ClassNames = {
  root: string
  rootIsActive: string
  rootIsDisabled: string
  rootIsInvalid: string
  label: string
  tagList: string
  tagListItem: string
  tag: string
  tagName: string
  comboBox: string
  input: string
  listBox: string
  option: string
  optionIsActive: string
  highlight: string
}

export type Tag = {
  label: string
  value: string | number | symbol | null
}

export type TagMetaProps = {
  disabled: boolean
}

export type TagInternalProps = {
  active: boolean
  index: number
  selected: boolean
}

export type TagSuggestion = Tag & Partial<TagMetaProps>

export type TagOption = Tag & TagMetaProps & TagInternalProps

export type TagSelected = Tag

export type OnAdd = (tag: Tag) => void

export type OnDelete = (index: number) => void

export type OnBlur = () => void

export type OnFocus = () => void

export type OnCollapse = () => void

export type OnExpand = () => void

export type OnInput = (value: string) => void

export type OnShouldCollapse = (value: string) => boolean

export type OnShouldExpand = (value: string) => boolean

export type OnValidate = (value: string) => boolean

export type SuggestionsTransform = (value: string, suggestions: TagSuggestion[]) => TagSuggestion[]

export type PublicAPI = {
  input: {
    blur(): void
    focus(): void
    get value(): string
    set value(value: string)
  }
  listBox: {
    collapse(): void
    expand(): void
    get activeOption(): TagSuggestion | null
    get isExpanded(): boolean
  }
  select(tag?: Tag): void
}
