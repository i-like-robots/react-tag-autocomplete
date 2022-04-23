import { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts'

export function useCaptureFocus(): void {
  const { inputRef, manager, tagListRef } = useContext(GlobalContext)

  const tagDeleted = manager.flags.tagDeleted
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
