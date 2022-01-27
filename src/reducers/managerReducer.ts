import { findTagIndex } from '../lib'
import { CreateNewOptionValue } from '../constants'
import type { SuggestionsTransform, TagSelected, TagSuggestion } from '../sharedTypes'

export enum ManagerActions {
  ClearActiveIndex,
  ClearValue,
  Collapse,
  Expand,
  UpdateActiveIndex,
  UpdateSelected,
  UpdateSuggestions,
  UpdateValue,
}

type ManagerAction =
  | { type: ManagerActions.ClearActiveIndex }
  | { type: ManagerActions.ClearValue }
  | { type: ManagerActions.Collapse }
  | { type: ManagerActions.Expand }
  | { type: ManagerActions.UpdateActiveIndex; payload: number }
  | { type: ManagerActions.UpdateSelected; payload: TagSelected[] }
  | { type: ManagerActions.UpdateSuggestions; payload: TagSuggestion[] }
  | { type: ManagerActions.UpdateValue; payload: string }

export type ManagerState = {
  activeIndex: number
  activeOption: TagSuggestion | null
  allowNew: boolean
  isExpanded: boolean
  newTagText: string
  selected: TagSelected[]
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

    const activeIndex = state.activeOption ? findTagIndex(state.activeOption, options) : -1

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

  if (action.type === ManagerActions.Collapse) {
    return {
      ...state,
      isExpanded: false,
    }
  }

  if (action.type === ManagerActions.Expand) {
    return {
      ...state,
      isExpanded: true,
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
    return { ...state, selected: action.payload }
  }

  if (action.type === ManagerActions.UpdateSuggestions) {
    const options = state.suggestionsTransform(state.value, action.payload)

    if (state.allowNew && state.value) {
      options.push(createNewTag(state.newTagText, state.value))
    }

    const activeIndex = state.activeOption ? findTagIndex(state.activeOption, options) : -1

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

    const activeIndex = state.activeOption ? findTagIndex(state.activeOption, options) : -1

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
