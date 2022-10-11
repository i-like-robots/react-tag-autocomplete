import { findTagIndex } from '../lib'
import type { SuggestionsTransform, Tag, TagSelected, TagSuggestion } from '../sharedTypes'

export enum ManagerActions {
  ClearActiveIndex,
  ClearAll,
  ClearValue,
  Collapse,
  Expand,
  UpdateActiveIndex,
  UpdateSelected,
  UpdateSuggestions,
  UpdateValue,
}

type ManagerAction<T extends Tag> =
  | { type: ManagerActions.ClearActiveIndex }
  | { type: ManagerActions.ClearAll }
  | { type: ManagerActions.ClearValue }
  | { type: ManagerActions.Collapse }
  | { type: ManagerActions.Expand }
  | { type: ManagerActions.UpdateActiveIndex; payload: number }
  | { type: ManagerActions.UpdateSelected; payload: TagSelected<T>[] }
  | { type: ManagerActions.UpdateSuggestions; payload: TagSuggestion<T>[] }
  | { type: ManagerActions.UpdateValue; payload: string }

export type ManagerState<T extends Tag> = {
  activeIndex: number
  activeOption: TagSuggestion<T> | null
  allowNew: boolean
  isExpanded: boolean
  newTagOption: (value: string) => TagSuggestion<T>
  noTagsOption: (value: string) => TagSuggestion<T>
  selected: TagSelected<T>[]
  suggestions: TagSuggestion<T>[]
  suggestionsTransform: SuggestionsTransform<T>
  options: TagSuggestion<T>[]
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

export function managerReducer<T extends Tag>(
  state: ManagerState<T>,
  action: ManagerAction<T>
): ManagerState<T> {
  if (action.type === ManagerActions.ClearActiveIndex) {
    return {
      ...state,
      activeIndex: -1,
      activeOption: null,
    }
  }

  if (action.type === ManagerActions.ClearAll) {
    return {
      ...state,
      activeIndex: -1,
      activeOption: null,
      isExpanded: false,
      options: [...state.suggestions],
      value: '',
    }
  }

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

  if (action.type === ManagerActions.Collapse) {
    return {
      ...state,
      activeIndex: -1,
      activeOption: null,
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
      options.push(state.newTagOption(state.value))
    }

    if (options.length === 0 && state.value) {
      options.push(state.noTagsOption(state.value))
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
      options.push(state.newTagOption(action.payload))
    }

    if (options.length === 0 && action.payload) {
      options.push(state.noTagsOption(action.payload))
    }

    const activeIndex = state.activeOption ? findTagIndex(state.activeOption, options) : -1

    return {
      ...state,
      activeIndex,
      activeOption: options[activeIndex] || null,
      isExpanded: true,
      options,
      value: action.payload,
    }
  }

  return state
}
