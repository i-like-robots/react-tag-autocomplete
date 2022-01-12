import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useInput, useInputSizer } from '../hooks'

export type InputProps = {
  allowBackspace?: boolean
  allowResize?: boolean
  placeholderText: string
}

export function Input({
  allowBackspace = true,
  allowResize = true,
  placeholderText,
}: InputProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const inputProps = useInput({ allowBackspace })
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
