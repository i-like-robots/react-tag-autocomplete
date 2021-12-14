import React from 'react'
import { useOption } from '../hooks/useOption'
import type { ClassNames, TagSuggestion } from '../sharedTypes'

export type OptionProps = {
  classNames: ClassNames
  tag: TagSuggestion
}

export function Option({ classNames, tag }: OptionProps): JSX.Element {
  const { active, disabled, optionProps } = useOption(tag)

  const classes = [classNames.suggestionsItem]

  disabled && classes.push(classNames.suggestionDisabled)
  active && classes.push(classNames.suggestionActive)
  // selected && classes.push(classNames.suggestionSelected)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      {tag.label}
    </div>
  )
}
