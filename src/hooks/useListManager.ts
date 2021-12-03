import { useEffect, useReducer, useRef } from 'react'
import { listReducer, ListReducerActions } from '../reducers/listReducer'
import type { ListReducerState } from '../reducers/listReducer'
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

export type UseListManagerState = UseListManagerAPI & { state: ListReducerState }

export function useListManager(initialState: ListReducerState): UseListManagerState {
  const api = useRef<UseListManagerState>()
  const [state, dispatch] = useReducer(listReducer, initialState)

  api.current ??= {
    state: null,
    clearAll() {
      dispatch({ type: ListReducerActions.ClearAll })
    },
    clearSelectedIndex() {
      dispatch({ type: ListReducerActions.ClearSelectedIndex })
    },
    selectedIndexNext() {
      dispatch({ type: ListReducerActions.SelectedIndexNext })
    },
    selectedIndexPrev() {
      dispatch({ type: ListReducerActions.SelectedIndexPrev })
    },
    setSelectedIndex(index: number) {
      dispatch({ type: ListReducerActions.SetSelectedIndex, payload: index })
    },
    updateSuggestions(suggestions: TagSuggestion[]) {
      dispatch({ type: ListReducerActions.UpdateSuggestions, payload: suggestions })
    },
    updateValue(value: string) {
      dispatch({ type: ListReducerActions.UpdateValue, payload: value })
    },
  }

  api.current.state = state

  useEffect(
    () => api.current.updateSuggestions(initialState.suggestions),
    [api, initialState.suggestions]
  )

  return api.current
}
