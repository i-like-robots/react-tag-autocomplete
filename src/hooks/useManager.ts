import { useReducer, useRef } from 'react'
import { managerReducer, ManagerActions } from '../reducers'
import type { ManagerState } from '../reducers'
import type { Tag, TagSelected, TagSuggestion } from '../sharedTypes'
import { arrayDiff } from '../lib/arrayDiff'

type ManagerFlags = {
  tagsAdded: Tag[]
  tagsDeleted: Tag[]
}

type ManagerAPI<T extends Tag> = {
  clearActiveIndex(): void
  clearAll(): void
  clearValue(): void
  collapse(): void
  expand(): void
  updateActiveIndex(index: number): void
  updateSelected(tags: TagSelected<T>[]): void
  updateSuggestions(suggestions: TagSuggestion<T>[]): void
  updateValue(value: string): void
}

export type UseManagerState<T extends Tag> = ManagerAPI<T> & {
  flags: ManagerFlags
  state: ManagerState<T>
}

function getInitialState<T extends Tag>(state: ManagerState<T>) {
  const options = state.suggestionsTransform(state.value, state.suggestions)
  return { ...state, options }
}

export function useManager<T extends Tag>(initialState: ManagerState<T>): UseManagerState<T> {
  const [state, dispatch] = useReducer(managerReducer, initialState, getInitialState)

  const api = useRef<UseManagerState<T>>({
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
    updateSelected(selected: TagSelected<T>[]) {
      dispatch({ type: ManagerActions.UpdateSelected, payload: selected })
    },
    updateSuggestions(suggestions: TagSuggestion<T>[]) {
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

  api.current.state = state as ManagerState<T> // FIXME

  if (initialState.selected !== state.selected) {
    api.current.updateSelected(initialState.selected)
  }

  if (initialState.suggestions !== state.suggestions) {
    api.current.updateSuggestions(initialState.suggestions)
  }

  return api.current
}
