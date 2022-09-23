import React, { useContext } from 'react'
import { OptionText } from '.'
import { NewOptionValue, NoOptionsValue } from '../constants'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'
import { InternalOptionText } from './InternalOption'
import type { ClassNames, TagOption } from '../sharedTypes'

type OptionRendererProps = React.ComponentPropsWithRef<'div'> & {
  children: React.ReactNode
  classNames: ClassNames
  option: TagOption
}

export type OptionRenderer = (props: OptionRendererProps) => JSX.Element

const DefaultOption: OptionRenderer = ({ children, classNames, option, ...optionProps }) => {
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
  render?: OptionRenderer
}

export function Option({ index, render = DefaultOption }: OptionProps): JSX.Element {
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
