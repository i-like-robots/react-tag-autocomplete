import { useEffect } from 'react'
import { useGlobalContext } from '../contexts'

export function useCaptureFocus(): void {
  const { inputRef, manager, tagListRef } = useGlobalContext()

  const tagDeleted = manager.flags.tagsDeleted.length
  const isFocusInList = tagListRef.current?.contains(document.activeElement)

  useEffect(() => {
    if (tagDeleted) {
      const isFocusInListNow = tagListRef.current?.contains(document.activeElement)

      if (isFocusInList && !isFocusInListNow) {
        inputRef.current?.focus()
      }
    }
  }, [inputRef, isFocusInList, tagListRef, tagDeleted])
}
