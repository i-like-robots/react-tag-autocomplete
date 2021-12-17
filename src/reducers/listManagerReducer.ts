import { findSuggestionIndex, matchSuggestionsPartial } from '../lib/textMatchers'
import { CreateNewOptionValue } from '../constants'
import type { TagSelected, TagSuggestion } from '../sharedTypes'
import { tagToKey } from '../lib'

export enum ListManagerActions {
  ClearAll,
  ClearSelectedIndex,
  SelectedIndexNext,
  SelectedIndexPrev,
  SetSelectedIndex,
  UpdateSelected,
  UpdateSuggestions,
  UpdateValue,
}

type ListManagerAction =
  | { type: ListManagerActions.ClearAll }
  | { type: ListManagerActions.ClearSelectedIndex }
  | { type: ListManagerActions.SelectedIndexNext }
  | { type: ListManagerActions.SelectedIndexPrev }
  | { type: ListManagerActions.SetSelectedIndex; payload: number }
  | { type: ListManagerActions.UpdateSelected; payload: TagSelected[] }
  | { type: ListManagerActions.UpdateSuggestions; payload: TagSuggestion[] }
  | { type: ListManagerActions.UpdateValue; payload: string }

export type ListManagerState = {
  allowNew: boolean
  newTagText: string
  // TODO: rename "Active"
  selectedIndex: number
  selectedTag: TagSuggestion | null
  selected: TagSelected[]
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
  if (action.type === ListManagerActions.ClearAll) {
    return {
      ...state,
      results: [],
      selectedIndex: -1,
      selectedTag: null,
      value: '',
    }
  }

  if (action.type === ListManagerActions.ClearSelectedIndex) {
    return {
      ...state,
      selectedIndex: -1,
      selectedTag: null,
    }
  }

  if (action.type === ListManagerActions.SelectedIndexNext) {
    const selectedIndex = loop(state.selectedIndex + 1, state.results.length)

    return {
      ...state,
      selectedIndex,
      selectedTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListManagerActions.SelectedIndexPrev) {
    const selectedIndex = loop(state.selectedIndex - 1, state.results.length)

    return {
      ...state,
      selectedIndex,
      selectedTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListManagerActions.SetSelectedIndex) {
    const selectedIndex = loop(action.payload, state.results.length)

    return {
      ...state,
      selectedIndex,
      selectedTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListManagerActions.UpdateSelected) {
    return { ...state, selected: action.payload }
  }

  if (action.type === ListManagerActions.UpdateSuggestions) {
    const results = matchSuggestionsPartial(state.value, action.payload)

    if (state.allowNew) results.push(createNewTag(state.newTagText, state.value))

    const selectedIndex = state.selectedTag
      ? findSuggestionIndex(state.selectedTag.value, results)
      : -1

    return {
      ...state,
      results,
      selectedIndex,
      selectedTag: results[selectedIndex] || null,
      suggestions: action.payload,
    }
  }

  if (action.type === ListManagerActions.UpdateValue) {
    const results = matchSuggestionsPartial(action.payload, state.suggestions)

    if (state.allowNew) results.push(createNewTag(state.newTagText, action.payload))

    const selectedIndex = state.selectedTag
      ? findSuggestionIndex(state.selectedTag.value, results)
      : -1

    return {
      ...state,
      results,
      selectedIndex,
      selectedTag: results[selectedIndex] || null,
      value: action.payload,
    }
  }

  return state
}
