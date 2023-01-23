import { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts'

export function useCaptureFocus(): void {
  const { inputRef, managerRef, tagListRef } = useContext(GlobalContext)

  const tagDeleted = managerRef.current.flags.tagsDeleted.length
  const isFocusInList = tagListRef.current?.contains(document.activeElement)

  useEffect(() => {
    if (tagDeleted) {
      const isFocusInListNow = tagListRef.current?.contains(document.activeElement)

      if (isFocusInList && !isFocusInListNow) {
        inputRef.current?.focus({ preventScroll: true })
      }
    }
  }, [inputRef, isFocusInList, tagListRef, tagDeleted])
}
