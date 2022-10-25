import { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { comboBoxId } from '../lib'
import type React from 'react'

export type UseComboBoxState = React.ComponentPropsWithRef<'div'>

export function useComboBox(): UseComboBoxState {
  const { comboBoxRef, id } = useContext(GlobalContext)

  return {
    id: comboBoxId(id),
    ref: comboBoxRef,
  }
}
