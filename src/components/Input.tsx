import React, { useContext } from 'react'
import { GlobalContext } from '../contexts'
import { useInput, useInputSizer } from '../hooks'
import type { ClassNames } from '../sharedTypes'

type InputRendererProps = React.ComponentPropsWithoutRef<'input'> & {
  classNames: ClassNames
  inputWidth: number
}

export type InputRenderer = (props: InputRendererProps) => JSX.Element

const DefaultInput: InputRenderer = ({ classNames, inputWidth, ...inputProps }) => {
  return <input className={classNames.input} style={{ width: inputWidth }} {...inputProps} />
}

export type InputProps = {
  allowBackspace?: boolean
  allowResize?: boolean
  ariaDescribedBy?: string
  ariaErrorMessage?: string
  delimiterKeys: string[]
  placeholderText: string
  render?: InputRenderer
}

export function Input({
  allowBackspace = true,
  allowResize = true,
  ariaDescribedBy,
  ariaErrorMessage,
  delimiterKeys,
  placeholderText,
  render = DefaultInput,
}: InputProps): JSX.Element {
  const { classNames } = useContext(GlobalContext)
  const { value, ...inputProps } = useInput({
    allowBackspace,
    ariaDescribedBy,
    ariaErrorMessage,
    delimiterKeys,
  })
  const text = value.length < placeholderText.length ? placeholderText : value
  const { width, sizerProps } = useInputSizer({ allowResize, text })

  return (
    <>
      {render({
        classNames,
        inputWidth: width,
        placeholder: placeholderText,
        value,
        ...inputProps,
      })}
      {allowResize ? <div {...sizerProps}>{text}</div> : null}
    </>
  )
}
