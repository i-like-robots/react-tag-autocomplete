import React from 'react'
import { ComboBoxContext } from '../contexts'
import { useComboBox } from '../hooks'
import type { ClassNames } from '../sharedTypes'

export type ComboBoxProps = React.PropsWithChildren<{ classNames: ClassNames }>

export function ComboBox({ children, classNames }: ComboBoxProps): JSX.Element {
  const { comboBoxProps, ...comboBoxState } = useComboBox()

  return (
    <ComboBoxContext.Provider value={comboBoxState}>
      <div className={classNames.comboBox} {...comboBoxProps}>
        {children}
      </div>
    </ComboBoxContext.Provider>
  )
}
