import { findSuggestionIndex, matchSuggestionsPartial } from '../lib/textMatchers'
import { CreateNewOptionValue } from '../constants'
import type { TagSelected, TagSuggestion } from '../sharedTypes'
import { tagsToKeys } from '../lib'

export enum ListManagerActions {
  ActiveIndexNext,
  ActiveIndexPrev,
  ActiveIndexSet,
  ClearAll,
  ClearSelectedIndex,
  UpdateSelected,
  UpdateSuggestions,
  UpdateValue,
}

type ListManagerAction =
  | { type: ListManagerActions.ActiveIndexNext }
  | { type: ListManagerActions.ActiveIndexPrev }
  | { type: ListManagerActions.ActiveIndexSet; payload: number }
  | { type: ListManagerActions.ClearAll }
  | { type: ListManagerActions.ClearSelectedIndex }
  | { type: ListManagerActions.UpdateSelected; payload: TagSelected[] }
  | { type: ListManagerActions.UpdateSuggestions; payload: TagSuggestion[] }
  | { type: ListManagerActions.UpdateValue; payload: string }

export type ListManagerState = {
  activeIndex: number
  activeTag: TagSuggestion | null
  allowNew: boolean
  newTagText: string
  selectedTags: TagSelected[]
  selectedKeys: Set<string>
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
      activeIndex: -1,
      activeTag: null,
      results: [],
      value: '',
    }
  }

  if (action.type === ListManagerActions.ClearSelectedIndex) {
    return {
      ...state,
      activeIndex: -1,
      activeTag: null,
    }
  }

  if (action.type === ListManagerActions.ActiveIndexNext) {
    const selectedIndex = loop(state.activeIndex + 1, state.results.length)

    return {
      ...state,
      activeIndex: selectedIndex,
      activeTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListManagerActions.ActiveIndexPrev) {
    const selectedIndex = loop(state.activeIndex - 1, state.results.length)

    return {
      ...state,
      activeIndex: selectedIndex,
      activeTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListManagerActions.ActiveIndexSet) {
    const selectedIndex = loop(action.payload, state.results.length)

    return {
      ...state,
      activeIndex: selectedIndex,
      activeTag: state.results[selectedIndex],
    }
  }

  if (action.type === ListManagerActions.UpdateSelected) {
    const selectedKeys = new Set(tagsToKeys(action.payload))
    return { ...state, selectedKeys, selectedTags: action.payload }
  }

  if (action.type === ListManagerActions.UpdateSuggestions) {
    const results = matchSuggestionsPartial(state.value, action.payload)

    if (state.allowNew) results.push(createNewTag(state.newTagText, state.value))

    const selectedIndex = state.activeTag ? findSuggestionIndex(state.activeTag.value, results) : -1

    return {
      ...state,
      activeIndex: selectedIndex,
      activeTag: results[selectedIndex] || null,
      results,
      suggestions: action.payload,
    }
  }

  if (action.type === ListManagerActions.UpdateValue) {
    const results = matchSuggestionsPartial(action.payload, state.suggestions)

    if (state.allowNew) results.push(createNewTag(state.newTagText, action.payload))

    const selectedIndex = state.activeTag ? findSuggestionIndex(state.activeTag.value, results) : -1

    return {
      ...state,
      activeIndex: selectedIndex,
      activeTag: results[selectedIndex] || null,
      results,
      value: action.payload,
    }
  }

  return state
}
