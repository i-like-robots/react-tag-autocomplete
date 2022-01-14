import { findSuggestionIndex, matchSuggestionsPartial } from '../lib/textMatchers'
import { CreateNewOptionValue } from '../constants'
import type { TagSelected, TagSuggestion } from '../sharedTypes'
import { tagsToKeys } from '../lib'

export enum ListManagerActions {
  ClearActiveIndex,
  ClearValue,
  UpdateActiveIndex,
  UpdateSelected,
  UpdateSuggestions,
  UpdateValue,
}

type ListManagerAction =
  | { type: ListManagerActions.ClearActiveIndex }
  | { type: ListManagerActions.ClearValue }
  | { type: ListManagerActions.UpdateActiveIndex; payload: number }
  | { type: ListManagerActions.UpdateSelected; payload: TagSelected[] }
  | { type: ListManagerActions.UpdateSuggestions; payload: TagSuggestion[] }
  | { type: ListManagerActions.UpdateValue; payload: string }

export type ListManagerState = {
  activeIndex: number
  activeOption: TagSuggestion | null
  allowNew: boolean
  newTagText: string
  selectedTags: TagSelected[]
  selectedKeys: string[]
  suggestions: TagSuggestion[]
  options: TagSuggestion[]
  value: string
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

function createNewTag(newTagText: string, value: string): TagSuggestion {
  return {
    label: newTagText.replace('%value%', value),
    value: CreateNewOptionValue,
  }
}

export function listManagerReducer(
  state: ListManagerState,
  action: ListManagerAction
): ListManagerState {
  if (action.type === ListManagerActions.ClearValue) {
    const options = [...state.suggestions]

    const activeIndex = state.activeOption
      ? findSuggestionIndex(state.activeOption.value, options)
      : -1

    return {
      ...state,
      activeIndex,
      activeOption: options[activeIndex],
      options,
      value: '',
    }
  }

  if (action.type === ListManagerActions.ClearActiveIndex) {
    return {
      ...state,
      activeIndex: -1,
      activeOption: null,
    }
  }

  if (action.type === ListManagerActions.UpdateActiveIndex) {
    const activeIndex = loop(action.payload, state.options.length)

    return {
      ...state,
      activeIndex,
      activeOption: state.options[activeIndex],
    }
  }

  if (action.type === ListManagerActions.UpdateSelected) {
    const selectedKeys = tagsToKeys(action.payload)
    return { ...state, selectedKeys, selectedTags: action.payload }
  }

  if (action.type === ListManagerActions.UpdateSuggestions) {
    const options = matchSuggestionsPartial(state.value, action.payload)

    if (state.allowNew && state.value) {
      options.push(createNewTag(state.newTagText, state.value))
    }

    const activeIndex = state.activeOption
      ? findSuggestionIndex(state.activeOption.value, options)
      : -1

    return {
      ...state,
      activeIndex,
      activeOption: options[activeIndex] || null,
      options,
      suggestions: action.payload,
    }
  }

  if (action.type === ListManagerActions.UpdateValue) {
    const options = matchSuggestionsPartial(action.payload, state.suggestions)

    if (state.allowNew && action.payload) {
      options.push(createNewTag(state.newTagText, action.payload))
    }

    const activeIndex = state.activeOption
      ? findSuggestionIndex(state.activeOption.value, options)
      : -1

    return {
      ...state,
      activeIndex,
      activeOption: options[activeIndex] || null,
      options,
      value: action.payload,
    }
  }

  return state
}
