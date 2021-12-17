import React from 'react'
import { useOption } from '../hooks'
import type { ClassNames, TagSuggestion } from '../sharedTypes'

export type OptionProps = {
  classNames: ClassNames
  tag: TagSuggestion
}

export function Option({ classNames, tag }: OptionProps): JSX.Element {
  const { active, optionProps } = useOption(tag)

  const classes = [classNames.suggestionsItem]

  active && classes.push(classNames.suggestionActive)

  return (
    <div className={classes.join(' ')} {...optionProps}>
      {tag.label}
    </div>
  )
}
