import { useEffect, useReducer, useRef } from 'react'
import { tagsToKeys } from '../lib'
import { listManagerReducer, ListManagerActions } from '../reducers'
import type { ListManagerState } from '../reducers'
import type { TagSelected, TagSuggestion } from '../sharedTypes'

export type UseListManagerAPI = {
  clearActiveIndex(): void
  clearValue(): void
  activeIndexNext(): void
  activeIndexPrev(): void
  setActiveIndex(index: number): void
  updateSelected(tags: TagSelected[]): void
  updateSuggestions(suggestions: TagSuggestion[]): void
  updateValue(value: string): void
}

export type UseListManagerState = UseListManagerAPI & { state: ListManagerState }

function getInitialState(initialState: ListManagerState) {
  const selectedKeys = new Set(tagsToKeys(initialState.selectedTags))
  return { ...initialState, selectedKeys }
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
    setActiveIndex(index: number) {
      dispatch({ type: ListManagerActions.ActiveIndexSet, payload: index })
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

  useEffect(
    () => api.current.updateSelected(initialState.selectedTags),
    [api, initialState.selectedTags]
  )

  useEffect(
    () => api.current.updateSuggestions(initialState.suggestions),
    [api, initialState.allowNew, initialState.newTagText, initialState.suggestions]
  )

  return api.current
}
