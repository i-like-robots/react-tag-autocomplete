import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useComboBox } from '../hooks'

export type ComboBoxProps = React.PropsWithChildren<Record<string, unknown>>

export function ComboBox({ children }: ComboBoxProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const comboBoxProps = useComboBox()

  return (
    <div className={classNames.comboBox} {...comboBoxProps}>
      {children}
    </div>
  )
}
