import { findSuggestionIndex, matchSuggestionsPartial } from '../lib/textMatchers'
import { CreateNewOptionValue } from '../constants'
import type { TagSelected, TagSuggestion } from '../sharedTypes'
import { tagsToKeys } from '../lib'

export enum ListManagerActions {
  ActiveIndexNext,
  ActiveIndexPrev,
  ClearActiveIndex,
  ClearValue,
  UpdateActiveIndex,
  UpdateSelected,
  UpdateSuggestions,
  UpdateValue,
}

type ListManagerAction =
  | { type: ListManagerActions.ActiveIndexNext }
  | { type: ListManagerActions.ActiveIndexPrev }
  | { type: ListManagerActions.ClearActiveIndex }
  | { type: ListManagerActions.ClearValue }
  | { type: ListManagerActions.UpdateActiveIndex; payload: number }
  | { type: ListManagerActions.UpdateSelected; payload: TagSelected[] }
  | { type: ListManagerActions.UpdateSuggestions; payload: TagSuggestion[] }
  | { type: ListManagerActions.UpdateValue; payload: string }

export type ListManagerState = {
  activeIndex: number
  activeTag: TagSuggestion | null
  allowNew: boolean
  newTagText: string
  selectedTags: TagSelected[]
  selectedKeys: string[]
  suggestions: TagSuggestion[]
  results: TagSuggestion[]
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
    const results = [...state.suggestions]
    const activeIndex = state.activeTag ? findSuggestionIndex(state.activeTag.value, results) : -1

    return {
      ...state,
      activeIndex,
      activeTag: results[activeIndex],
      results,
      value: '',
    }
  }

  if (action.type === ListManagerActions.ClearActiveIndex) {
    return {
      ...state,
      activeIndex: -1,
      activeTag: null,
    }
  }

  if (action.type === ListManagerActions.ActiveIndexNext) {
    const activeIndex = loop(state.activeIndex + 1, state.results.length)

    return {
      ...state,
      activeIndex,
      activeTag: state.results[activeIndex],
    }
  }

  if (action.type === ListManagerActions.ActiveIndexPrev) {
    const activeIndex = loop(state.activeIndex - 1, state.results.length)

    return {
      ...state,
      activeIndex,
      activeTag: state.results[activeIndex],
    }
  }

  if (action.type === ListManagerActions.UpdateActiveIndex) {
    const activeIndex = loop(action.payload, state.results.length)

    return {
      ...state,
      activeIndex,
      activeTag: state.results[activeIndex],
    }
  }

  if (action.type === ListManagerActions.UpdateSelected) {
    const selectedKeys = tagsToKeys(action.payload)
    return { ...state, selectedKeys, selectedTags: action.payload }
  }

  if (action.type === ListManagerActions.UpdateSuggestions) {
    const results = matchSuggestionsPartial(state.value, action.payload)

    if (state.allowNew && state.value) {
      results.push(createNewTag(state.newTagText, state.value))
    }

    const activeIndex = state.activeTag ? findSuggestionIndex(state.activeTag.value, results) : -1

    return {
      ...state,
      activeIndex,
      activeTag: results[activeIndex] || null,
      results,
      suggestions: action.payload,
    }
  }

  if (action.type === ListManagerActions.UpdateValue) {
    const results = matchSuggestionsPartial(action.payload, state.suggestions)

    if (state.allowNew && action.payload) {
      results.push(createNewTag(state.newTagText, action.payload))
    }

    const activeIndex = state.activeTag ? findSuggestionIndex(state.activeTag.value, results) : -1

    return {
      ...state,
      activeIndex,
      activeTag: results[activeIndex] || null,
      results,
      value: action.payload,
    }
  }

  return state
}
