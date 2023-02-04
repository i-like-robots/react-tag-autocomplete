import React, { useCallback, useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts'
import { labelId, listBoxId } from '../lib'

export type UseListBoxState = React.ComponentPropsWithRef<'div'>

export function useListBox(): UseListBoxState {
  const { id, inputRef, listBoxRef, managerRef } = useContext(GlobalContext)

  const scrollToTop = managerRef.current.state.activeIndex === -1

  const onFocus = useCallback(
    (e: React.FocusEvent) => {
      if (e.target !== inputRef.current) {
        inputRef.current?.focus({ preventScroll: true })
      }
    },
    [inputRef]
  )

  useEffect(() => {
    if (scrollToTop) {
      listBoxRef.current?.scrollTo({ top: 0 })
    }
  }, [listBoxRef, scrollToTop])

  return {
    'aria-labelledby': labelId(id),
    id: listBoxId(id),
    onFocus,
    ref: listBoxRef,
    role: 'listbox',
    tabIndex: -1,
  }
}
