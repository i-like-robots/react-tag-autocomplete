import React, { useContext } from 'react'
import { OptionText } from '.'
import { NewOptionValue, NoOptionsValue } from '../constants'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'
import { InternalOptionText } from './InternalOption'
import type { ClassNames } from '../sharedTypes'

type OptionComponentProps = React.ComponentPropsWithRef<'div'> & {
  active: boolean
  children: React.ReactNode
  classNames: ClassNames
}

function OptionComponent({
  active,
  children,
  classNames,
  ...optionProps
}: OptionComponentProps): JSX.Element {
  const classes = [classNames.option]

  if (active) classes.push(classNames.optionIsActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      {children}
    </div>
  )
}

export type OptionProps = {
  index: number
  render?: (props: OptionComponentProps) => JSX.Element
}

export function Option({ index, render = OptionComponent }: OptionProps): JSX.Element {
  const { classNames, manager } = useContext(GlobalContext)
  const { active, label, value, optionProps } = useOption(index)

  const children =
    value === NewOptionValue || value === NoOptionsValue ? (
      <InternalOptionText label={label} query={manager.state.value} />
    ) : (
      <OptionText label={label} query={manager.state.value} />
    )

  return render({ active, classNames, children, ...optionProps })
}
