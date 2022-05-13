import React, { useContext } from 'react'
import { OptionText } from '.'
import { NewOptionValue, NoOptionsValue } from '../constants'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'
import { InternalOptionText } from './InternalOption'

export type OptionProps = {
  index: number
}

export function Option({ index }: OptionProps): JSX.Element {
  const { classNames, manager } = useContext(GlobalContext)
  const { active, label, value, optionProps } = useOption(index)

  const classes = [classNames.option]

  if (active) classes.push(classNames.optionIsActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      {value === NewOptionValue || value === NoOptionsValue ? (
        <InternalOptionText label={label} query={manager.state.value} />
      ) : (
        <OptionText label={label} query={manager.state.value} />
      )}
    </div>
  )
}
