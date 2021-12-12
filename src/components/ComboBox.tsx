import React from 'react'
import { ComboBoxContext } from '../contexts'
import { useComboBox } from '../hooks'
import type { ClassNames } from '../sharedTypes'

export type ComboBoxProps = React.PropsWithChildren<{ classNames: ClassNames }>

export function ComboBox({ children, classNames }: ComboBoxProps): JSX.Element {
  const { comboBoxProps, ...comboBoxState } = useComboBox()

  return (
    <div className={classNames.search} {...comboBoxProps}>
      <ComboBoxContext.Provider value={comboBoxState}>{children}</ComboBoxContext.Provider>
    </div>
  )
}
