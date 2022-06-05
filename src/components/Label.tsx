import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { labelId } from '../lib'
import type { ClassNames } from '../sharedTypes'

type LabelComponentProps = {
  children: React.ReactNode
  classNames: ClassNames
  id: string
}

function LabelComponent({ children, classNames, id }: LabelComponentProps): JSX.Element {
  return (
    <div className={classNames.label} id={id}>
      {children}
    </div>
  )
}

export type LabelProps = {
  children: React.ReactNode
  render?: (props: LabelComponentProps) => JSX.Element
}

export function Label({ children, render = LabelComponent }: LabelProps): JSX.Element {
  const { classNames, id } = useContext(GlobalContext)
  return render({ children, classNames, id: labelId(id) })
}
