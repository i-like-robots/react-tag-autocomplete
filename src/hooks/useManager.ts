import { useReducer, useRef } from 'react'
import { managerReducer, ManagerActions } from '../reducers'
import type { ManagerProps, ManagerState } from '../reducers'
import type { Tag, TagSuggestion } from '../sharedTypes'
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
  updateSuggestions(suggestions: TagSuggestion[]): void
  updateValue(value: string): void
}

export type UseManagerState = ManagerAPI & {
  flags: ManagerFlags
  props: ManagerProps
  state: ManagerState
}

function getInitialState(props: ManagerProps): ManagerState {
  const options = props.suggestionsTransform('', props.suggestions)

  return {
    activeIndex: -1,
    activeOption: null,
    isExpanded: false,
    options,
    value: '',
  }
}

export function useManager(props: ManagerProps): UseManagerState {
  const [state, dispatch] = useReducer(managerReducer, null, () => getInitialState(props))

  const api = useRef<UseManagerState>({
    props: null,
    state: null,
    flags: null,
    clearActiveIndex() {
      dispatch({ type: ManagerActions.ClearActiveIndex })
    },
    clearAll() {
      dispatch({ type: ManagerActions.ClearAll, props: this.props })
    },
    clearValue() {
      dispatch({ type: ManagerActions.ClearValue, props: this.props })
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
    updateSuggestions(suggestions: TagSuggestion[]) {
      dispatch({ type: ManagerActions.UpdateSuggestions, payload: suggestions, props: this.props })
    },
    updateValue(value: string) {
      dispatch({ type: ManagerActions.UpdateValue, payload: value, props: this.props })
    },
  })

  const flags = {
    tagsAdded: api.current.props ? arrayDiff(props.selected, api.current.props.selected) : [],
    tagsDeleted: api.current.props ? arrayDiff(api.current.props.selected, props.selected) : [],
  }

  if (api.current.props && api.current.props.suggestions !== props.suggestions) {
    api.current.updateSuggestions(props.suggestions)
  }

  Object.assign(api.current, { flags, props, state })

  return api.current
}
