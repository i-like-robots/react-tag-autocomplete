import React, { useContext } from 'react'
import { OptionText } from '.'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'
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
  const { classNames, managerRef } = useContext(GlobalContext)
  const { option, optionProps } = useOption(index)

  const children = <OptionText option={option} query={managerRef.current.state.value} />

  return render({ classNames, children, option, ...optionProps })
}
