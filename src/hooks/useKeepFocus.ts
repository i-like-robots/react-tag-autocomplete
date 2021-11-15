import { useEffect } from 'react'
import { usePrevious } from './usePrevious'
import type { SelectedTag } from '../sharedTypes'

export type UseKeepFocusProps = {
  containerRef: React.MutableRefObject<HTMLDivElement>
  tags: SelectedTag[]
}

export function useKeepFocus({ containerRef, tags }: UseKeepFocusProps): void {
  const prevLength = usePrevious<number>(tags.length)
  const wasTagRemoved = tags.length < prevLength
  const wasFocusInside = wasTagRemoved
    ? containerRef.current?.contains(document.activeElement)
    : null

  useEffect(() => {
    if (wasFocusInside && !containerRef.current?.contains(document.activeElement)) {
      containerRef.current?.focus()
    }
  }, [containerRef, wasFocusInside])
}
