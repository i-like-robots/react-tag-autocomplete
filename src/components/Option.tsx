import React, { useContext } from 'react'
import { OptionText } from '.'
import { NewOptionValue, NoOptionsValue } from '../constants'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'
import { InternalOptionText } from './InternalOption'
import type { ClassNames, TagOption } from '../sharedTypes'

type OptionComponentProps = React.ComponentPropsWithRef<'div'> & {
  children: React.ReactNode
  classNames: ClassNames
  option: TagOption
}

function OptionComponent({
  children,
  classNames,
  option,
  ...optionProps
}: OptionComponentProps): JSX.Element {
  const classes = [classNames.option]

  if (option.active) classes.push(classNames.optionIsActive)

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
  const { option, optionProps } = useOption(index)

  const children =
    option.value === NewOptionValue || option.value === NoOptionsValue ? (
      <InternalOptionText label={option.label} query={manager.state.value} />
    ) : (
      <OptionText label={option.label} query={manager.state.value} />
    )

  return render({ classNames, children, option, ...optionProps })
}
