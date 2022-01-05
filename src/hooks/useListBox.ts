import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../contexts'

export type UseListBoxState = React.ComponentPropsWithRef<'div'>

export function useListBox(): UseListBoxState {
  const { id, listBoxRef, listManager } = useContext(GlobalContext)

  useEffect(() => {
    if (listManager.state.activeIndex === -1) {
      listBoxRef.current?.scrollTo({ top: 0 })
    }
  }, [listBoxRef, listManager.state.activeIndex])

  return {
    'aria-labelledby': `${id}-label`,
    id: `${id}-listbox`,
    ref: listBoxRef,
    role: 'listbox',
  }
}
