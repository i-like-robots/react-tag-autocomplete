import React, { useContext } from 'react'
import { ComboBoxContext, GlobalContext } from '../contexts'
import { useComboBox } from '../hooks'

export type ComboBoxProps = React.PropsWithChildren<Record<string, unknown>>

export function ComboBox({ children }: ComboBoxProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { comboBoxProps, ...comboBoxState } = useComboBox()

  return (
    <ComboBoxContext.Provider value={comboBoxState}>
      <div className={classNames.comboBox} {...comboBoxProps}>
        {children}
      </div>
    </ComboBoxContext.Provider>
  )
}
