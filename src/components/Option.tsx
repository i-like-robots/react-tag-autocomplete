import React, { useLayoutEffect, useRef } from 'react'
import type { ClassNames, TagOption } from '../sharedTypes'

export type OptionProps = TagOption & {
  classNames: ClassNames
  optionProps: React.ComponentPropsWithRef<'div'>
}

export function Option({
  classNames,
  disabled,
  // focused,
  label,
  optionProps,
  selected,
}: OptionProps): JSX.Element {
  const optionRef = useRef<HTMLDivElement>()
  const classes = [classNames.suggestionsItem]

  disabled && classes.push(classNames.suggestionDisabled)
  // focused && classes.push(classNames.suggestionFocused)
  selected && classes.push(classNames.suggestionActive)

  useLayoutEffect(() => {
    if (selected) {
      optionRef.current?.scrollIntoView({ block: 'nearest', inline: 'start' })
    }
  }, [selected])

  return (
    <div className={classes.join(' ')} ref={optionRef} {...optionProps}>
      {label}
    </div>
  )
}
