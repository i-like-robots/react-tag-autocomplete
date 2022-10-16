import { findTagIndex } from '../lib'
import type { SuggestionsTransform, TagSelected, TagSuggestion } from '../sharedTypes'

export enum ManagerActions {
  ClearActiveIndex,
  ClearAll,
  ClearValue,
  Collapse,
  Expand,
  UpdateActiveIndex,
  UpdateSuggestions,
  UpdateValue,
}

type ManagerAction =
  | { type: ManagerActions.ClearActiveIndex }
  | { type: ManagerActions.ClearAll; props: ManagerProps }
  | { type: ManagerActions.ClearValue; props: ManagerProps }
  | { type: ManagerActions.Collapse }
  | { type: ManagerActions.Expand }
  | { type: ManagerActions.UpdateActiveIndex; payload: number }
  | { type: ManagerActions.UpdateSuggestions; payload: TagSuggestion[]; props: ManagerProps }
  | { type: ManagerActions.UpdateValue; payload: string; props: ManagerProps }

export type ManagerState = {
  activeIndex: number
  activeOption: TagSuggestion | null
  isExpanded: boolean
  options: TagSuggestion[]
  value: string
}

export type ManagerProps = {
  allowNew: boolean
  newTagOption: (value: string) => TagSuggestion // TODO
  noTagsOption: (value: string) => TagSuggestion // TODO
  selected: TagSelected[]
  suggestions: TagSuggestion[]
  suggestionsTransform: SuggestionsTransform
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

export function managerReducer(state: ManagerState, action: ManagerAction): ManagerState {
  if (action.type === ManagerActions.ClearActiveIndex) {
    return {
      ...state,
      activeIndex: -1,
      activeOption: null,
    }
  }

  if (action.type === ManagerActions.ClearAll) {
    return {
      ...state,
      activeIndex: -1,
      activeOption: null,
      isExpanded: false,
      options: [...action.props.suggestions],
      value: '',
    }
  }

  if (action.type === ManagerActions.ClearValue) {
    const options = [...action.props.suggestions]

    const activeIndex = state.activeOption ? findTagIndex(state.activeOption, options) : -1

    return {
      ...state,
      activeIndex,
      activeOption: options[activeIndex],
      options,
      value: '',
    }
  }

  if (action.type === ManagerActions.Collapse) {
    return {
      ...state,
      activeIndex: -1,
      activeOption: null,
      isExpanded: false,
    }
  }

  if (action.type === ManagerActions.Expand) {
    return {
      ...state,
      isExpanded: true,
    }
  }

  if (action.type === ManagerActions.UpdateActiveIndex) {
    const activeIndex = loop(action.payload, state.options.length)

    return {
      ...state,
      activeIndex,
      activeOption: state.options[activeIndex],
    }
  }

  if (action.type === ManagerActions.UpdateSuggestions) {
    const options = action.props.suggestionsTransform(state.value, action.payload)

    if (action.props.allowNew && state.value) {
      options.push(action.props.newTagOption(state.value))
    }

    if (options.length === 0 && state.value) {
      options.push(action.props.noTagsOption(state.value))
    }

    const activeIndex = state.activeOption ? findTagIndex(state.activeOption, options) : -1

    return {
      ...state,
      activeIndex,
      activeOption: options[activeIndex] || null,
      options,
    }
  }

  if (action.type === ManagerActions.UpdateValue) {
    const options = action.props.suggestionsTransform(action.payload, action.props.suggestions)

    if (action.props.allowNew && action.payload) {
      options.push(action.props.newTagOption(action.payload))
    }

    if (options.length === 0 && action.payload) {
      options.push(action.props.noTagsOption(action.payload))
    }

    const activeIndex = state.activeOption ? findTagIndex(state.activeOption, options) : -1

    return {
      ...state,
      activeIndex,
      activeOption: options[activeIndex] || null,
      isExpanded: true,
      options,
      value: action.payload,
    }
  }

  return state
}
