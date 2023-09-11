import React, { useEffect } from 'react'

export function useScrollIntoView(
  targetRef: React.MutableRefObject<HTMLElement>,
  containerRef: React.MutableRefObject<HTMLElement>,
  shouldScroll: boolean
) {
  useEffect(() => {
    if (shouldScroll) {
      const targetHeight = targetRef.current?.offsetHeight
      const targetOffset = targetRef.current?.offsetTop
      const containerHeight = containerRef.current?.offsetHeight
      const containerScroll = containerRef.current?.scrollTop

      if (targetOffset < containerScroll) {
        containerRef.current.scrollTo(0, targetOffset)
      }

      if (targetOffset + targetHeight > containerScroll + containerHeight) {
        containerRef.current.scrollTo(0, targetOffset + targetHeight - containerHeight)
      }
    }
  }, [shouldScroll, containerRef, targetRef])
}
