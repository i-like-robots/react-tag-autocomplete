import { useEffect, useReducer, useRef } from 'react'
import { listManagerReducer, ListManagerActions } from '../reducers'
import type { ListManagerState } from '../reducers'
import type { TagSuggestion } from '../sharedTypes'

export type UseListManagerAPI = {
  clearAll(): void
  clearSelectedIndex(): void
  selectedIndexNext(): void
  selectedIndexPrev(): void
  setSelectedIndex(index: number): void
  updateSuggestions(suggestions: TagSuggestion[]): void
  updateValue(value: string): void
}

export type UseListManagerState = UseListManagerAPI & { state: ListManagerState }

export function useListManager(initialState: ListManagerState): UseListManagerState {
  const api = useRef<UseListManagerState>()
  const [state, dispatch] = useReducer(listManagerReducer, initialState)

  api.current ??= {
    state: null,
    clearAll() {
      dispatch({ type: ListManagerActions.ClearAll })
    },
    clearSelectedIndex() {
      dispatch({ type: ListManagerActions.ClearSelectedIndex })
    },
    selectedIndexNext() {
      dispatch({ type: ListManagerActions.SelectedIndexNext })
    },
    selectedIndexPrev() {
      dispatch({ type: ListManagerActions.SelectedIndexPrev })
    },
    setSelectedIndex(index: number) {
      dispatch({ type: ListManagerActions.SetSelectedIndex, payload: index })
    },
    updateSuggestions(suggestions: TagSuggestion[]) {
      dispatch({ type: ListManagerActions.UpdateSuggestions, payload: suggestions })
    },
    updateValue(value: string) {
      dispatch({ type: ListManagerActions.UpdateValue, payload: value })
    },
  }

  api.current.state = state

  useEffect(
    () => api.current.updateSuggestions(initialState.suggestions),
    [api, initialState.suggestions]
  )

  return api.current
}
