import React from 'react'
import { OptionText } from '.'
import { NewOptionValue, NoOptionsValue } from '../constants'
import { useGlobalContext } from '../contexts'
import { useOption } from '../hooks'
import { InternalOptionText } from './InternalOption'
import type { ClassNames, Tag, TagOption } from '../sharedTypes'

type OptionRendererProps<T extends Tag> = React.ComponentPropsWithRef<'div'> & {
  children: React.ReactNode
  classNames: ClassNames
  option: TagOption<T>
}

export type OptionRenderer<T extends Tag> = (props: OptionRendererProps<T>) => JSX.Element

const DefaultOption = <T extends Tag>({
  children,
  classNames,
  option,
  ...optionProps
}: OptionRendererProps<T>) => {
  const classes = [classNames.option]

  if (option.active) classes.push(classNames.optionIsActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      {children}
    </div>
  )
}

export type OptionProps<T extends Tag> = {
  index: number
  render?: OptionRenderer<T>
}

export function Option<T extends Tag>({
  index,
  render = DefaultOption,
}: OptionProps<T>): JSX.Element {
  const { classNames, manager } = useGlobalContext<T>()
  const { option, optionProps } = useOption<T>(index)

  const children =
    option.value === NewOptionValue || option.value === NoOptionsValue ? (
      <InternalOptionText label={option.label} query={manager.state.value} />
    ) : (
      <OptionText label={option.label} query={manager.state.value} />
    )

  return render({ classNames, children, option, ...optionProps })
}
