import { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts'
import { usePrevious } from './'

export function useManageFocus(): void {
  const { manager, rootRef, tagListRef } = useContext(GlobalContext)

  const currentLength = manager.state.selected.length
  const prevLength = usePrevious<number>(currentLength)
  const wasTagRemoved = currentLength < prevLength

  const currentFocusInList = tagListRef.current?.contains(document.activeElement)
  const prevFocusInList = usePrevious<boolean>(currentFocusInList)

  useEffect(() => {
    if (wasTagRemoved) {
      const currentFocusInList = tagListRef.current?.contains(document.activeElement)
      const wasFocusLost = prevFocusInList && !currentFocusInList

      if (wasFocusLost) rootRef.current?.focus()
    }
  }, [prevFocusInList, rootRef, tagListRef, wasTagRemoved])
}
