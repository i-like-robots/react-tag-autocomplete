import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { comboBoxId } from '../lib'

export type ComboBoxProps = React.PropsWithChildren<Record<string, unknown>>

export function ComboBox({ children }: ComboBoxProps): React.JSX.Element {
  const { classNames, comboBoxRef, id } = useContext(GlobalContext)

  return (
    <div className={classNames.comboBox} id={comboBoxId(id)} ref={comboBoxRef}>
      {children}
    </div>
  )
}
