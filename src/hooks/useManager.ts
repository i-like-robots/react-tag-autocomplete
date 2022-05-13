import { useReducer, useRef } from 'react'
import { managerReducer, ManagerActions } from '../reducers'
import type { ManagerState } from '../reducers'
import type { Tag, TagSelected, TagSuggestion } from '../sharedTypes'
import { arrayDiff } from '../lib/arrayDiff'

type ManagerFlags = {
  tagsAdded: Tag[]
  tagsDeleted: Tag[]
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
  const [state, dispatch] = useReducer(managerReducer, initialState, getInitialState)

  const api = useRef<UseManagerState>({
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
  })

  api.current.flags = {
    tagsAdded: api.current.state ? arrayDiff(state.selected, api.current.state.selected) : [],
    tagsDeleted: api.current.state ? arrayDiff(api.current.state.selected, state.selected) : [],
  }

  api.current.state = state

  if (initialState.selected !== state.selected) {
    api.current.updateSelected(initialState.selected)
  }

  if (initialState.suggestions !== state.suggestions) {
    api.current.updateSuggestions(initialState.suggestions)
  }

  return api.current
}
