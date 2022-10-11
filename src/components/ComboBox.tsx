import React from 'react'
import { useGlobalContext } from '../contexts'
import { useComboBox } from '../hooks'

export type ComboBoxProps = React.PropsWithChildren<Record<string, unknown>>

export function ComboBox({ children }: ComboBoxProps): JSX.Element {
  const { classNames } = useGlobalContext()
  const comboBoxProps = useComboBox()

  return (
    <div className={classNames.comboBox} {...comboBoxProps}>
      {children}
    </div>
  )
}
