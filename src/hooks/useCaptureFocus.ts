import { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts'
import { usePrevious } from '.'

export function useCaptureFocus(): void {
  const { inputRef, manager, tagListRef } = useContext(GlobalContext)

  const currentLength = manager.state.selected.length
  const prevLength = usePrevious<number>(currentLength)
  const wasTagRemoved = currentLength < prevLength

  const currentFocusInList = tagListRef.current?.contains(document.activeElement)
  const prevFocusInList = usePrevious<boolean>(currentFocusInList)

  useEffect(() => {
    if (wasTagRemoved) {
      const currentFocusInList = tagListRef.current?.contains(document.activeElement)
      const wasFocusLost = prevFocusInList && !currentFocusInList

      if (wasFocusLost) inputRef.current?.focus()
    }
  }, [inputRef, prevFocusInList, tagListRef, wasTagRemoved])
}
