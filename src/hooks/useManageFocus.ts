import { useContext, useEffect } from 'react'
import { InternalRefs } from '../contexts'
import { usePrevious } from './'

export function useManageFocus(): void {
  const { rootRef, listManager } = useContext(InternalRefs)

  const currentLength = listManager.state.selectedTags.length
  const prevLength = usePrevious<number>(currentLength)
  const wasTagRemoved = currentLength < prevLength
  const wasFocusInside = wasTagRemoved && rootRef.current?.contains(document.activeElement)

  useEffect(() => {
    if (wasFocusInside && !rootRef.current?.contains(document.activeElement)) {
      rootRef.current?.focus()
    }
  }, [rootRef, wasFocusInside])
}
