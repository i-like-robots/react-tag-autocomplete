import { findSuggestionIndex, matchSuggestionsPartial } from '../lib/textMatchers'
import type { TagSuggestion } from '../sharedTypes'

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

export enum ListReducerActions {
  ClearAll,
  ClearSelectedIndex,
  SelectedIndexNext,
  SelectedIndexPrev,
  SetSelectedIndex,
  UpdateSuggestions,
  UpdateValue,
}

type ListReducerAction =
  | { type: ListReducerActions.ClearAll }
  | { type: ListReducerActions.ClearSelectedIndex }
  | { type: ListReducerActions.SelectedIndexNext }
  | { type: ListReducerActions.SelectedIndexPrev }
  | { type: ListReducerActions.SetSelectedIndex; payload: number }
  | { type: ListReducerActions.UpdateSuggestions; payload: TagSuggestion[] }
  | { type: ListReducerActions.UpdateValue; payload: string }

export type ListReducerState = {
  selectedIndex: number
  selectedTag: TagSuggestion | null
  suggestions: TagSuggestion[]
  results: TagSuggestion[]
  value: string
}

export function listReducer(state: ListReducerState, action: ListReducerAction): ListReducerState {
  if (action.type === ListReducerActions.ClearAll) {
    return {
      ...state,
      results: [],
      selectedIndex: -1,
      selectedTag: null,
      value: '',
    }
  }

  if (action.type === ListReducerActions.ClearSelectedIndex) {
    return {
      ...state,
      selectedIndex: -1,
      selectedTag: null,
    }
  }

  if (action.type === ListReducerActions.SelectedIndexNext) {
    const selectedIndex = loop(state.selectedIndex + 1, state.results.length)

    return {
      ...state,
      selectedIndex,
      selectedTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListReducerActions.SelectedIndexPrev) {
    const selectedIndex = loop(state.selectedIndex - 1, state.results.length)

    return {
      ...state,
      selectedIndex,
      selectedTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListReducerActions.SetSelectedIndex) {
    const selectedIndex = loop(action.payload, state.results.length)

    return {
      ...state,
      selectedIndex,
      selectedTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListReducerActions.UpdateSuggestions) {
    const results = matchSuggestionsPartial(state.value, action.payload)
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

  if (action.type === ListReducerActions.UpdateValue) {
    const results = matchSuggestionsPartial(action.payload, state.suggestions)
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
