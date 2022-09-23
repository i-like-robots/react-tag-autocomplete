import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { labelId } from '../lib'
import type { ClassNames } from '../sharedTypes'

type LabelRendererProps = {
  children: React.ReactNode
  classNames: ClassNames
  id: string
}

export type LabelRenderer = (props: LabelRendererProps) => JSX.Element

const DefaultLabel: LabelRenderer = ({ children, classNames, id }) => {
  return (
    <div className={classNames.label} id={id}>
      {children}
    </div>
  )
}

export type LabelProps = {
  children: React.ReactNode
  render?: LabelRenderer
}

export function Label({ children, render = DefaultLabel }: LabelProps): JSX.Element {
  const { classNames, id } = useContext(GlobalContext)
  return render({ children, classNames, id: labelId(id) })
}
