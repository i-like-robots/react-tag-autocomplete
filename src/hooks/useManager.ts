import { useReducer, useRef } from 'react'
import { managerReducer, ManagerActions } from '../reducers'
import type { ManagerState } from '../reducers'
import type { TagSelected, TagSuggestion } from '../sharedTypes'

type ManagerAPI = {
  clearActiveIndex(): void
  clearValue(): void
  updateActiveIndex(index: number): void
  updateSelected(tags: TagSelected[]): void
  updateSuggestions(suggestions: TagSuggestion[]): void
  updateValue(value: string): void
}

export type UseManagerState = ManagerAPI & { state: ManagerState }

function getInitialState(initialState: ManagerState) {
  return { ...initialState, options: [...initialState.suggestions] }
}

export function useManager(initialState: ManagerState): UseManagerState {
  const api = useRef<UseManagerState>()
  const [state, dispatch] = useReducer(managerReducer, initialState, getInitialState)

  api.current ??= {
    state: null,
    clearActiveIndex() {
      dispatch({ type: ManagerActions.ClearActiveIndex })
    },
    clearValue() {
      dispatch({ type: ManagerActions.ClearValue })
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

  api.current.state = state

  if (initialState.selectedTags !== state.selectedTags) {
    api.current.updateSelected(initialState.selectedTags)
  }

  if (initialState.suggestions !== state.suggestions) {
    api.current.updateSuggestions(initialState.suggestions)
  }

  return api.current
}
