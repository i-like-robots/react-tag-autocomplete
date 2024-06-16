import { useContext, useLayoutEffect, useRef } from 'react'
import { GlobalContext } from '../contexts'

export type UseTagListArgs = {
  label: string
}

export type UseTagListState = React.ComponentPropsWithRef<'ul'>

export function useTagList({ label }: UseTagListArgs): UseTagListState {
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

  return { ref: listRef, 'aria-label': label }
}
