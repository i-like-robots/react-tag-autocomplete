import { useCallback, useContext } from 'react'
import { CreateNewOptionValue } from '../constants'
import { GlobalContext } from '../contexts'
import { findSuggestionExact, tagToKey } from '../lib'
import type { Tag, TagSelected } from '../sharedTypes'

export type UseOnSelectState = () => void

export function useOnSelect(): UseOnSelectState {
  const { isDisabled, listManager, onAddition, onDelete } = useContext(GlobalContext)
  const { activeOption, options, selectedKeys, value } = listManager.state

  const selectTag = useCallback(
    (tag: TagSelected) => {
      const index = selectedKeys.indexOf(tagToKey(tag))
      const result = index > -1 ? onDelete(index) : onAddition(tag)

      if (result) listManager.clearValue()
    },
    [listManager, onAddition, onDelete, selectedKeys]
  )

  const getNewTag = useCallback((): Tag => {
    if (activeOption?.value === CreateNewOptionValue) {
      return { label: value, value: null }
    }
  }, [activeOption, value])

  const getActiveTag = useCallback((): Tag => {
    if (activeOption && activeOption?.disabled !== true) {
      return { label: activeOption.label, value: activeOption.value }
    }
  }, [activeOption])

  const getExactTag = useCallback((): Tag => {
    if (value && options.length) {
      const match = findSuggestionExact(value, options)
      if (match) return { label: match.label, value: match.value }
    }
  }, [options, value])

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
