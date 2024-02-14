import { useContext, useLayoutEffect, useRef } from 'react'
import { GlobalContext } from '../contexts'

// export type UseTagListArgs = {}

export type UseTagListState = {
  listRef: React.MutableRefObject<HTMLUListElement>
}

export function useTagList(): UseTagListState {
  const { rootRef, managerRef } = useContext(GlobalContext)

  const listRef = useRef<HTMLUListElement>()

  const tagDeleted = managerRef.current.flags.tagsDeleted[0]
  const isFocusInList = listRef.current?.contains(document.activeElement)

  useLayoutEffect(() => {
    if (tagDeleted) {
      const isFocusInListNow = listRef.current?.contains(document.activeElement)

      if (isFocusInList && !isFocusInListNow) {
        rootRef.current?.focus({ preventScroll: true })
      }
    }
  }, [isFocusInList, listRef, rootRef, tagDeleted])

  return { listRef }
}
