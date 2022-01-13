import { useReducer, useRef } from 'react'
import { tagsToKeys } from '../lib'
import { listManagerReducer, ListManagerActions } from '../reducers'
import type { ListManagerState } from '../reducers'
import type { TagSelected, TagSuggestion } from '../sharedTypes'

export type UseListManagerAPI = {
  clearActiveIndex(): void
  clearValue(): void
  activeIndexNext(): void
  activeIndexPrev(): void
  updateActiveIndex(index: number): void
  updateSelected(tags: TagSelected[]): void
  updateSuggestions(suggestions: TagSuggestion[]): void
  updateValue(value: string): void
}

export type UseListManagerState = UseListManagerAPI & { state: ListManagerState }

function getInitialState(initialState: ListManagerState) {
  const selectedKeys = tagsToKeys(initialState.selectedTags)
  return { ...initialState, results: [...initialState.suggestions], selectedKeys }
}

export function useListManager(initialState: ListManagerState): UseListManagerState {
  const api = useRef<UseListManagerState>()
  const [state, dispatch] = useReducer(listManagerReducer, initialState, getInitialState)

  api.current ??= {
    state: null,
    activeIndexNext() {
      dispatch({ type: ListManagerActions.ActiveIndexNext })
    },
    activeIndexPrev() {
      dispatch({ type: ListManagerActions.ActiveIndexPrev })
    },
    clearActiveIndex() {
      dispatch({ type: ListManagerActions.ClearActiveIndex })
    },
    clearValue() {
      dispatch({ type: ListManagerActions.ClearValue })
    },
    updateActiveIndex(index: number) {
      dispatch({ type: ListManagerActions.UpdateActiveIndex, payload: index })
    },
    updateSelected(selected: TagSelected[]) {
      dispatch({ type: ListManagerActions.UpdateSelected, payload: selected })
    },
    updateSuggestions(suggestions: TagSuggestion[]) {
      dispatch({ type: ListManagerActions.UpdateSuggestions, payload: suggestions })
    },
    updateValue(value: string) {
      dispatch({ type: ListManagerActions.UpdateValue, payload: value })
    },
  }

  api.current.state = state

  if (initialState.selectedTags !== state.selectedTags) {
    api.current.updateSelected(initialState.selectedTags)
  }

  if (initialState.suggestions !== state.suggestions) {
    api.current.updateSuggestions(initialState.suggestions)
  }

  return api.current
}
