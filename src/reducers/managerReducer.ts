import { findSuggestionIndex } from '../lib/textMatchers'
import { CreateNewOptionValue } from '../constants'
import { tagsToKeys } from '../lib'
import type { SuggestionsTransform, TagSelected, TagSuggestion } from '../sharedTypes'

export enum ManagerActions {
  ClearActiveIndex,
  ClearValue,
  UpdateActiveIndex,
  UpdateSelected,
  UpdateSuggestions,
  UpdateValue,
}

type ManagerAction =
  | { type: ManagerActions.ClearActiveIndex }
  | { type: ManagerActions.ClearValue }
  | { type: ManagerActions.UpdateActiveIndex; payload: number }
  | { type: ManagerActions.UpdateSelected; payload: TagSelected[] }
  | { type: ManagerActions.UpdateSuggestions; payload: TagSuggestion[] }
  | { type: ManagerActions.UpdateValue; payload: string }

export type ManagerState = {
  activeIndex: number
  activeOption: TagSuggestion | null
  allowNew: boolean
  newTagText: string
  selectedTags: TagSelected[]
  selectedKeys: string[]
  suggestions: TagSuggestion[]
  suggestionsTransform: SuggestionsTransform
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

export function managerReducer(state: ManagerState, action: ManagerAction): ManagerState {
  if (action.type === ManagerActions.ClearValue) {
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

  if (action.type === ManagerActions.ClearActiveIndex) {
    return {
      ...state,
      activeIndex: -1,
      activeOption: null,
    }
  }

  if (action.type === ManagerActions.UpdateActiveIndex) {
    const activeIndex = loop(action.payload, state.options.length)

    return {
      ...state,
      activeIndex,
      activeOption: state.options[activeIndex],
    }
  }

  if (action.type === ManagerActions.UpdateSelected) {
    const selectedKeys = tagsToKeys(action.payload)
    return { ...state, selectedKeys, selectedTags: action.payload }
  }

  if (action.type === ManagerActions.UpdateSuggestions) {
    const options = state.suggestionsTransform(state.value, action.payload)

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

  if (action.type === ManagerActions.UpdateValue) {
    const options = state.suggestionsTransform(action.payload, state.suggestions)

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
