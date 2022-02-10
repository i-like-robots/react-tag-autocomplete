import React, { useContext } from 'react'
import { OptionText } from '.'
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
      {label === '' && typeof value === 'symbol' ? (
        <InternalOptionText query={manager.state.value} value={value} />
      ) : (
        <OptionText label={label} query={manager.state.value} />
      )}
    </div>
  )
}
