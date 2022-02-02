import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useInput, useInputSizer } from '../hooks'

export type InputProps = {
  allowBackspace?: boolean
  allowResize?: boolean
  allowTab?: boolean
  placeholderText: string
}

export function Input({
  allowBackspace = true,
  allowResize = true,
  allowTab = false,
  placeholderText,
}: InputProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { value, ...inputProps } = useInput({ allowBackspace, allowTab })
  const text = value.length < placeholderText.length ? placeholderText : value
  const { sizerProps, width } = useInputSizer({ allowResize, text })

  return (
    <>
      <input
        className={classNames.input}
        placeholder={placeholderText}
        style={{ width }}
        value={value}
        {...inputProps}
      />
      {allowResize ? <div {...sizerProps}>{text}</div> : null}
    </>
  )
}
