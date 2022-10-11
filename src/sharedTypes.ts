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
  noOptions: string
  option: string
  optionIsActive: string
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

export type TagSuggestion<T extends Tag> = T & Partial<TagMetaProps>

export type TagOption<T extends Tag> = T & TagMetaProps & TagInternalProps

export type TagSelected<T extends Tag> = T

export type OnAdd<T extends Tag> = (tag: T) => void

export type OnDelete = (index: number) => void

export type OnInput = (value: string) => void

export type OnValidate = (value?: string) => boolean

export type OnSelect<T extends Tag> = (tag?: T) => void

export type SuggestionsTransform<T extends Tag> = (
  value: string,
  suggestions: TagSuggestion<T>[]
) => TagSuggestion<T>[]

export type PublicAPI<T extends Tag> = {
  input: {
    clear(): void
    focus(): void
    get value(): string
    set value(value: string)
  }
  listBox: {
    collapse(): void
    expand(): void
    get activeIndex(): number
    set activeIndex(index: number)
    get isExpanded(): boolean
    get options(): TagSuggestion<T>[]
  }
}
