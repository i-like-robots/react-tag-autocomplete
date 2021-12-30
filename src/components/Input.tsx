import React from 'react'
import { useInput, useInputSizer } from '../hooks'
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
  const text = String(inputProps.value || placeholderText)
  const { sizerProps, width } = useInputSizer({ allowResize, text })

  return (
    <>
      <input
        className={classNames.input}
        placeholder={placeholderText}
        style={{ width }}
        {...inputProps}
      />
      {allowResize ? <div {...sizerProps}>{text}</div> : null}
    </>
  )
}
