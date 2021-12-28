import { useContext, useEffect } from 'react'
import { InternalRefs } from '../contexts'
import { usePrevious } from './'

export function useManageFocus(): void {
  const { rootRef, listManager } = useContext(InternalRefs)

  const currentLength = listManager.state.selectedTags.length
  const prevLength = usePrevious<number>(currentLength)
  const wasTagRemoved = currentLength < prevLength

  const currentFocusInside = rootRef.current?.contains(document.activeElement)
  const prevFocusInside = usePrevious<boolean>(currentFocusInside)
  const wasFocusLost = prevFocusInside && !currentFocusInside

  useEffect(() => {
    if (wasTagRemoved && wasFocusLost) rootRef.current?.focus()
  }, [rootRef, wasFocusLost, wasTagRemoved])
}
