import { useCallback } from 'react'
import { CreateNewOptionValue } from '../constants'
import { findSuggestionExact, tagToKey } from '../lib'
import type { UseListManagerState } from '.'
import type { Tag, TagSelected } from '../sharedTypes'

export type UseOnSelectState = () => void

export function useOnSelect(
  manager: UseListManagerState,
  isDisabled: boolean,
  onAddition: (tag: TagSelected) => boolean,
  onDelete: (index: number) => boolean
): UseOnSelectState {
  const { activeTag, results, selectedKeys, value } = manager.state

  const selectTag = useCallback(
    (tag: TagSelected) => {
      const index = selectedKeys.indexOf(tagToKey(tag))

      if (index > -1) {
        onDelete(index) && manager.clearValue()
      } else {
        onAddition(tag) && manager.clearValue()
      }
    },
    [manager, onAddition, onDelete, selectedKeys]
  )

  const getNewTag = useCallback((): Tag => {
    if (activeTag?.value === CreateNewOptionValue) {
      return { label: value, value: null }
    }
  }, [activeTag, value])

  const getActiveTag = useCallback((): Tag => {
    if (activeTag && activeTag?.disabled !== true) {
      return { label: activeTag.label, value: activeTag.value }
    }
  }, [activeTag])

  const getExactTag = useCallback((): Tag => {
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
    if (newTag) return selectTag(newTag)

    const activeTag = getActiveTag()
    if (activeTag) return selectTag(activeTag)

    const exactTag = getExactTag()
    if (exactTag) return selectTag(exactTag)
  }, [selectTag, getActiveTag, getExactTag, getNewTag, isDisabled])
}
