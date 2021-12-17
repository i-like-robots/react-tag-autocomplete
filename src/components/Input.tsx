import React from 'react'
import { useInput } from '../hooks'
import { useInputWidth } from '../hooks/useInputWidth'
import type { ClassNames } from '../sharedTypes'

export type InputProps = {
  allowResize?: boolean
  classNames: ClassNames
  placeholderText: string
}

export function Input({
  allowResize = true,
  classNames,
  placeholderText,
}: InputProps): JSX.Element {
  const inputProps = useInput()

  const sizerValue = String(inputProps.value || placeholderText)

  const { sizerProps, width } = useInputWidth({
    allowResize,
    value: sizerValue,
  })

  return (
    <div className={classNames.searchWrapper}>
      <input
        className={classNames.searchInput}
        placeholder={placeholderText}
        style={{ width }}
        {...inputProps}
      />
      {allowResize ? <div {...sizerProps}>{sizerValue}</div> : null}
    </div>
  )
}
