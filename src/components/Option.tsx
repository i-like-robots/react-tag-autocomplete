import React, { useContext } from 'react'
import { OptionText } from '.'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'

export type OptionProps = {
  index: number
}

export function Option({ index }: OptionProps): JSX.Element {
  const { classNames, listManager } = useContext(GlobalContext)
  const { active, label, optionProps } = useOption(index)

  const classes = [classNames.option]

  if (active) classes.push(classNames.optionIsActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      <OptionText label={label} value={listManager.state.value} />
    </div>
  )
}
