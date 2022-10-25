import { useMemo, useRef, useState } from 'react'
import { findTagIndex } from '../lib'
import { arrayDiff } from '../lib/arrayDiff'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type {
  OnCollapse,
  OnExpand,
  OnInput,
  OnValidate,
  SuggestionsTransform,
  Tag,
  TagSelected,
  TagSuggestion,
} from '../sharedTypes'

export type ManagerAPI = {
  clearActiveIndex(): void
  clearAll(): void
  clearValue(): void
  collapse(): void
  expand(): void
  updateActiveIndex(index: number): void
  updateValue(value: string): void
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
  allowNew: boolean
  newOptionText: string
  noOptionsText: string
  onCollapse?: OnCollapse
  onExpand?: OnExpand
  onInput?: OnInput
  onValidate?: OnValidate
  selected: TagSelected[]
  startWithFirstOption: boolean
  suggestions: TagSuggestion[]
  suggestionsTransform: SuggestionsTransform
}

export type UseManagerState = ManagerAPI & {
  flags: ManagerFlags
  state: ManagerState
}

function loop(next: number, size: number, min: number): number {
  const max = size - 1

  if (next > max) {
    return min
  }

  if (next < min) {
    return max
  }

  return next
}

export function useManagerTwo({
  allowNew,
  newOptionText,
  noOptionsText,
  onCollapse,
  onExpand,
  onInput,
  onValidate,
  selected,
  startWithFirstOption,
  suggestions,
  suggestionsTransform,
}: ManagerProps) {
  const ref = useRef<UseManagerState>()

  const [activeOption, setActiveOption] = useState<TagSuggestion>(null)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')

  const options = useMemo(() => {
    const opts = suggestionsTransform(value, suggestions)

    if (allowNew && value) {
      const isValid = typeof onValidate === 'function' ? onValidate(value) : true

      opts.push({
        disabled: !isValid,
        label: newOptionText,
        value: NewOptionValue,
      })
    }

    if (opts.length === 0 && value) {
      opts.push({
        disabled: true,
        label: noOptionsText,
        value: NoOptionsValue,
      })
    }

    return opts
  }, [allowNew, newOptionText, noOptionsText, onValidate, suggestions, suggestionsTransform, value])

  const optionIndex = activeOption ? findTagIndex(activeOption, options) : -1
  const activeIndex = startWithFirstOption ? Math.max(optionIndex, 0) : optionIndex

  const api = {
    clearActiveIndex() {
      setActiveOption(null)
    },
    clearAll() {
      setActiveOption(null)
      this.collapse()
      this.updateValue('')
    },
    clearValue() {
      this.updateValue('')
    },
    collapse() {
      if (isExpanded) {
        setIsExpanded(false)
        setActiveOption(null)
        onCollapse?.()
      }
    },
    expand() {
      if (!isExpanded) {
        setIsExpanded(true)
        setActiveOption(options[activeIndex])
        onExpand?.()
      }
    },
    updateActiveIndex(index: number) {
      const activeIndex = loop(index, options.length, startWithFirstOption ? 0 : -1)
      setActiveOption(options[activeIndex])
    },
    updateValue(newValue: string) {
      if (value !== newValue) {
        setValue(newValue)
        onInput?.(newValue)
      }
    },
  }

  const flags = {
    tagsAdded: ref.current ? arrayDiff(selected, ref.current.state.selected) : [],
    tagsDeleted: ref.current ? arrayDiff(ref.current.state.selected, selected) : [],
  }

  const state = {
    activeIndex,
    activeOption,
    isExpanded,
    options,
    selected,
    value,
  }

  ref.current = Object.assign(ref.current || {}, { ...api, flags, state })

  return ref.current
}
