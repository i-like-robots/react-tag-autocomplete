import React, { useMemo, useRef, useState } from 'react'
import { arrayDiff, findSelectedOption, findTagIndex, loopOptionsIndex } from '../lib'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type {
  OnAdd,
  OnCollapse,
  OnDelete,
  OnExpand,
  OnInput,
  OnValidate,
  SuggestionsTransform,
  Tag,
  TagSelected,
  TagSuggestion,
} from '../sharedTypes'

export type ManagerAPI = {
  listBoxCollapse(): void
  listBoxExpand(): void
  updateActiveIndex(index: number): void
  updateInputValue(value: string): void
  selectTag(tag?: Tag): void
}

export type ManagerState = {
  activeIndex: number
  activeOption: TagSuggestion | null
  isExpanded: boolean
  options: TagSuggestion[]
  selected: TagSelected[]
  value: string
}

export type ManagerFlags = {
  tagsAdded: Tag[]
  tagsDeleted: Tag[]
}

export type ManagerProps = {
  activateFirstOption: boolean
  allowNew: boolean
  closeOnSelect: boolean
  newOptionText: string
  noOptionsText: string
  onAdd: OnAdd
  onDelete: OnDelete
  onCollapse?: OnCollapse
  onExpand?: OnExpand
  onInput?: OnInput
  onValidate?: OnValidate
  selected: TagSelected[]
  suggestions: TagSuggestion[]
  suggestionsTransform: SuggestionsTransform
}

export type UseManagerState = ManagerAPI & {
  flags: ManagerFlags
  state: ManagerState
}

export function useManager({
  activateFirstOption,
  allowNew,
  closeOnSelect,
  newOptionText,
  noOptionsText,
  onAdd,
  onDelete,
  onCollapse,
  onExpand,
  onInput,
  onValidate,
  selected,
  suggestions,
  suggestionsTransform,
}: ManagerProps): React.MutableRefObject<UseManagerState> {
  const ref = useRef<UseManagerState>()

  const [lastActiveOption, setLastActiveOption] = useState<TagSuggestion>(null)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')

  const options: TagSuggestion[] = useMemo(() => {
    const opts = suggestionsTransform(value, suggestions)

    if (value) {
      if (allowNew) {
        opts.push({
          disabled: typeof onValidate === 'function' ? !onValidate(value) : false,
          label: newOptionText,
          value: NewOptionValue,
        })
      }

      if (opts.length === 0) {
        opts.push({
          disabled: true,
          label: noOptionsText,
          value: NoOptionsValue,
        })
      }
    }

    return opts
  }, [allowNew, newOptionText, noOptionsText, onValidate, suggestions, suggestionsTransform, value])

  const optionIndex = lastActiveOption ? findTagIndex(lastActiveOption, options) : -1
  const activeIndex = activateFirstOption ? Math.max(optionIndex, 0) : optionIndex
  const activeOption = options[activeIndex]

  const state: ManagerState = {
    activeIndex,
    activeOption,
    isExpanded,
    options,
    selected,
    value,
  }

  const flags: ManagerFlags = {
    tagsAdded: ref.current ? arrayDiff(selected, ref.current.state.selected) : [],
    tagsDeleted: ref.current ? arrayDiff(ref.current.state.selected, selected) : [],
  }

  const api: ManagerAPI = {
    listBoxCollapse() {
      if (isExpanded) {
        setIsExpanded(false)
        setLastActiveOption(null)
        onCollapse?.()
      }
    },
    listBoxExpand() {
      if (!isExpanded) {
        setIsExpanded(true)
        setLastActiveOption(options[activeIndex])
        onExpand?.()
      }
    },
    updateActiveIndex(index: number) {
      const activeIndex = loopOptionsIndex(index, options.length, activateFirstOption ? 0 : -1)
      setLastActiveOption(options[activeIndex])
    },
    updateInputValue(newValue: string) {
      if (value !== newValue) {
        setValue(newValue)
        onInput?.(newValue)
      }
    },
    selectTag(tag?: Tag) {
      tag ??= findSelectedOption(state)

      if (tag) {
        const tagIndex = findTagIndex(tag, state.selected)

        if (tagIndex > -1) {
          onDelete(tagIndex)
        } else {
          onAdd(tag)
        }

        if (closeOnSelect) {
          this.listBoxCollapse()
        }

        this.updateInputValue('')
      }
    },
  }

  ref.current = { ...api, flags, state }

  return ref
}
