import { useContext, useEffect } from 'react'
import { InternalRefs } from '../contexts'
import { usePrevious } from './'

export function useManageFocus(): void {
  const { listManager, rootRef, tagListRef } = useContext(InternalRefs)

  const currentLength = listManager.state.selectedTags.length
  const prevLength = usePrevious<number>(currentLength)
  const wasTagRemoved = currentLength < prevLength

  const currentFocusInList = tagListRef.current?.contains(document.activeElement)
  const prevFocusInList = usePrevious<boolean>(currentFocusInList)
  const wasFocusLost = prevFocusInList && !currentFocusInList

  useEffect(() => {
    if (wasTagRemoved && wasFocusLost) rootRef.current?.focus()
  }, [rootRef, wasFocusLost, wasTagRemoved])
}
