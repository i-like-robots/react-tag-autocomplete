import React, { useContext } from 'react'
import { OptionText } from '.'
import { GlobalContext } from '../contexts'
import { useOption } from '../hooks'
import type { ClassNames, TagSuggestion } from '../sharedTypes'

export type OptionProps = {
  classNames: ClassNames
  tag: TagSuggestion
}

export function Option({ classNames, tag }: OptionProps): JSX.Element {
  const { active, optionProps } = useOption(tag)
  const { listManager } = useContext(GlobalContext)

  const classes = [classNames.option]

  if (active) classes.push(classNames.optionIsActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      <OptionText label={tag.label} value={listManager.state.value} />
    </div>
  )
}
