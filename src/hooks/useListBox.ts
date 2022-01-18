import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts'
import { labelId, listBoxId } from '../lib'

export type UseListBoxState = React.ComponentPropsWithRef<'div'>

export function useListBox(): UseListBoxState {
  const { id, listBoxRef, manager } = useContext(GlobalContext)

  useEffect(() => {
    if (manager.state.activeIndex === -1) {
      listBoxRef.current?.scrollTo({ top: 0 })
    }
  }, [listBoxRef, manager.state.activeIndex])

  return {
    'aria-labelledby': labelId(id),
    id: listBoxId(id),
    ref: listBoxRef,
    role: 'listbox',
  }
}
