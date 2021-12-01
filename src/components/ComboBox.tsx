import React from 'react'
import type { ReactNode } from 'react'
import type { ClassNames } from '../sharedTypes'

export type ComboBoxProps = {
  children: ReactNode[]
  classNames: ClassNames
  comboBoxProps: React.ComponentPropsWithRef<'div'>
}

export function ComboBox({ children, classNames, comboBoxProps }: ComboBoxProps): JSX.Element {
  return (
    <div className={classNames.search} {...comboBoxProps}>
      {children}
    </div>
  )
}
