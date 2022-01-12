import React, { useContext } from 'react'
import { OptionText } from '.'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'
import type { TagSuggestion } from '../sharedTypes'

export type OptionProps = {
  tag: TagSuggestion
}

export function Option({ tag }: OptionProps): JSX.Element {
  const { classNames, listManager } = useContext(GlobalContext)
  const { active, optionProps } = useOption(tag)

  const classes = [classNames.option]

  if (active) classes.push(classNames.optionIsActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      <OptionText label={tag.label} value={listManager.state.value} />
    </div>
  )
}
