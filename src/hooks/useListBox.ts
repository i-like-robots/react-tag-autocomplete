import React, { useContext } from 'react'
import { InternalRefs } from '../contexts'

export type UseListBoxState = React.ComponentPropsWithRef<'div'>

export function useListBox(): UseListBoxState {
  const { id, listBoxRef } = useContext(InternalRefs)

  return {
    id: `${id}-listbox`,
    ref: listBoxRef,
    role: 'listbox',
  }
}
