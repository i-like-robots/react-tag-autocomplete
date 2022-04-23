import { useReducer, useRef } from 'react'
import { managerReducer, ManagerActions } from '../reducers'
import type { ManagerState } from '../reducers'
import type { TagSelected, TagSuggestion } from '../sharedTypes'

type ManagerFlags = {
  tagAdded: boolean
  tagDeleted: boolean
}

type ManagerAPI = {
  clearActiveIndex(): void
  clearAll(): void
  clearValue(): void
  collapse(): void
  expand(): void
  updateActiveIndex(index: number): void
  updateSelected(tags: TagSelected[]): void
  updateSuggestions(suggestions: TagSuggestion[]): void
  updateValue(value: string): void
}

export type UseManagerState = ManagerAPI & { flags: ManagerFlags; state: ManagerState }

function getInitialState(initialState: ManagerState) {
  return { ...initialState, options: [...initialState.suggestions] }
}

export function useManager(initialState: ManagerState): UseManagerState {
  const api = useRef<UseManagerState>()
  const [state, dispatch] = useReducer(managerReducer, initialState, getInitialState)

  api.current ??= {
    state: null,
    flags: null,
    clearActiveIndex() {
      dispatch({ type: ManagerActions.ClearActiveIndex })
    },
    clearAll() {
      dispatch({ type: ManagerActions.ClearAll })
    },
    clearValue() {
      dispatch({ type: ManagerActions.ClearValue })
    },
    collapse() {
      dispatch({ type: ManagerActions.Collapse })
    },
    expand() {
      dispatch({ type: ManagerActions.Expand })
    },
    updateActiveIndex(index: number) {
      dispatch({ type: ManagerActions.UpdateActiveIndex, payload: index })
    },
    updateSelected(selected: TagSelected[]) {
      dispatch({ type: ManagerActions.UpdateSelected, payload: selected })
    },
    updateSuggestions(suggestions: TagSuggestion[]) {
      dispatch({ type: ManagerActions.UpdateSuggestions, payload: suggestions })
    },
    updateValue(value: string) {
      dispatch({ type: ManagerActions.UpdateValue, payload: value })
    },
  }

  const flags = {
    tagAdded: api.current.state?.selected.length < state.selected.length,
    tagDeleted: api.current.state?.selected.length > state.selected.length,
  }

  api.current.state = state
  api.current.flags = flags

  if (initialState.selected !== state.selected) {
    api.current.updateSelected(initialState.selected)
  }

  if (initialState.suggestions !== state.suggestions) {
    api.current.updateSuggestions(initialState.suggestions)
  }

  return api.current
}
