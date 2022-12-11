import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts'
import { labelId, listBoxId } from '../lib'

export type UseListBoxState = React.ComponentPropsWithRef<'div'>

export function useListBox(): UseListBoxState {
  const { id, listBoxRef, managerRef } = useContext(GlobalContext)

  const scrollToTop = managerRef.current.state.activeIndex === -1

  useEffect(() => {
    if (scrollToTop) {
      listBoxRef.current?.scrollTo({ top: 0 })
    }
  }, [listBoxRef, scrollToTop])

  return {
    'aria-labelledby': labelId(id),
    id: listBoxId(id),
    ref: listBoxRef,
    role: 'listbox',
  }
}
