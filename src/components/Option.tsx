import React, { useLayoutEffect, useRef } from 'react'
import type { HTMLAttributes } from 'react'
import type { ClassNames } from '../sharedTypes'

export type OptionProps = {
  classNames: ClassNames
  index: number
  isDisabled: boolean
  isSelected: boolean
  label: string
  value: string | number
  optionProps: HTMLAttributes<HTMLElement>
}

export function Option({
  classNames,
  isDisabled,
  isSelected,
  label,
  optionProps,
}: OptionProps): JSX.Element {
  const optionRef = useRef<HTMLDivElement>()
  const classes = [classNames.suggestionsItem]

  isDisabled && classes.push(classNames.suggestionDisabled)
  isSelected && classes.push(classNames.suggestionActive)

  useLayoutEffect(() => {
    if (isSelected) {
      optionRef.current?.scrollIntoView({ block: 'nearest', inline: 'start' })
    }
  }, [isSelected])

  return (
    <div className={classes.join(' ')} ref={optionRef} {...optionProps}>
      {label}
    </div>
  )
}
