import React, { useContext } from 'react'
import { OptionText } from '.'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'

export type OptionProps = {
  index: number
}

export function Option({ index }: OptionProps): JSX.Element {
  const { classNames, manager } = useContext(GlobalContext)
  const { active, label, optionProps, disableMarkText } = useOption(index)

  const classes = [classNames.option]

  if (active) classes.push(classNames.optionIsActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      {disableMarkText ? label : <OptionText label={label} value={manager.state.value} />}
    </div>
  )
}
