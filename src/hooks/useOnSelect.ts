import { useCallback, useContext } from 'react'
import { CreateNewOptionValue } from '../constants'
import { GlobalContext } from '../contexts'
import { findSuggestionExact, tagToKey } from '../lib'
import type { Tag, TagSelected } from '../sharedTypes'

export type UseOnSelectState = () => void

export function useOnSelect(): UseOnSelectState {
  const { isDisabled, listManager, onAddition, onDelete } = useContext(GlobalContext)
  const { activeTag, results, selectedKeys, value } = listManager.state

  const selectTag = useCallback(
    (tag: TagSelected) => {
      const index = selectedKeys.indexOf(tagToKey(tag))
      const result = index > -1 ? onDelete(index) : onAddition(tag)

      if (result) listManager.clearValue()
    },
    [listManager, onAddition, onDelete, selectedKeys]
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
      if (match) return { label: match.label, value: match.value }
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
