import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'

export type UseListBoxState = React.ComponentPropsWithRef<'div'>

export function useListBox(): UseListBoxState {
  const { id, listBoxRef } = useContext(GlobalContext)

  return {
    id: `${id}-listbox`,
    ref: listBoxRef,
    role: 'listbox',
  }
}
