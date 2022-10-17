import { useMemo, useRef, useState } from 'react'
import { findTagIndex } from '../lib'
import { arrayDiff } from '../lib/arrayDiff'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type {
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
  onValidate?: OnValidate
  selected: TagSelected[]
  suggestions: TagSuggestion[]
  suggestionsTransform: SuggestionsTransform
}

export type UseManagerState = ManagerAPI & {
  flags: ManagerFlags
  state: ManagerState
}

function loop(next: number, size: number): number {
  const max = size - 1

  if (next > max) {
    return -1
  }

  if (next < -1) {
    return max
  }

  return next
}

export function useManagerTwo({
  allowNew,
  newOptionText,
  noOptionsText,
  onValidate,
  selected,
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
      const disabled = typeof onValidate === 'function' ? !onValidate(value) : false

      opts.push({
        disabled,
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

  const activeIndex = activeOption ? findTagIndex(activeOption, options) : -1

  const api = {
    clearActiveIndex() {
      setActiveOption(null)
    },
    clearAll() {
      setActiveOption(null)
      setIsExpanded(false)
      setValue('')
    },
    clearValue() {
      setValue('')
    },
    collapse() {
      setIsExpanded(false)
      setActiveOption(null)
    },
    expand() {
      setIsExpanded(true)
    },
    updateActiveIndex(index: number) {
      const activeIndex = loop(index, options.length)
      setActiveOption(options[activeIndex])
    },
    updateValue(value: string) {
      setValue(value)
      setIsExpanded(true)
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
