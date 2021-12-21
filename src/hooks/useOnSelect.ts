import { useCallback } from 'react'
import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact, tagToKey } from '../lib'
import type { UseListManagerState } from '.'
import type { Tag, TagSelected, TagSuggestion } from '../sharedTypes'

export type UseOnSelectState = (tag?: TagSuggestion) => void

export function useOnSelect(
  manager: UseListManagerState,
  isDisabled: boolean,
  onAddition: (tag: TagSelected) => boolean
): UseOnSelectState {
  const { activeTag, results, selectedKeys, value } = manager.state

  const addTag = useCallback(
    (tag: TagSelected) => {
      if (onAddition(tag)) manager.clearValue()
    },
    [manager, onAddition]
  )

  const getNewTag = useCallback((): Tag => {
    if (activeTag?.value === CreateNewOptionValue) {
      return { label: value, value: null }
    }
  }, [activeTag, value])

  const getActiveTag = useCallback((): Tag => {
    if (
      activeTag &&
      activeTag?.disabled !== true &&
      selectedKeys.has(tagToKey(activeTag)) !== true
    ) {
      return { label: activeTag.label, value: activeTag.value }
    }
  }, [activeTag, selectedKeys])

  const getExactTag = useCallback(() => {
    if (value && results.length) {
      const match = findSuggestionExact(value, results)

      if (match) {
        return { label: match.label, value: match.value }
      }
    }
  }, [results, value])

  return useCallback(() => {
    if (isDisabled) return

    const newTag = getNewTag()
    if (newTag) return addTag(newTag)

    const activeTag = getActiveTag()
    if (activeTag) return addTag(activeTag)

    const exactTag = getExactTag()
    if (exactTag) return addTag(exactTag)
  }, [addTag, getActiveTag, getExactTag, getNewTag, isDisabled])
}
