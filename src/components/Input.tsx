import React, { useRef } from 'react'
import { useInputWidth } from '../hooks/useInputWidth'
import type { CSSProperties, InputHTMLAttributes } from 'react'
import type { ClassNames } from '../sharedTypes'

const SizerStyles: CSSProperties = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  overflow: 'scroll',
  whiteSpace: 'pre',
}

export type InputProps = {
  allowResize?: boolean
  ariaLabelText: string
  classNames: ClassNames
  inputProps: InputHTMLAttributes<HTMLInputElement>
  inputRef: React.MutableRefObject<HTMLInputElement>
  placeholderText: string
}

export function Input({
  allowResize = true,
  ariaLabelText,
  classNames,
  inputProps,
  inputRef,
  placeholderText,
}: InputProps): JSX.Element {
  const sizerRef = useRef<HTMLDivElement>()

  const inputWidth = useInputWidth({
    allowResize,
    inputRef,
    placeholderText,
    sizerRef,
    value: String(inputProps.value),
  })

  return (
    <div className={classNames.searchWrapper}>
      <input
        ref={inputRef}
        aria-label={ariaLabelText}
        className={classNames.searchInput}
        placeholder={placeholderText}
        style={{ width: inputWidth }}
        {...inputProps}
      />
      <div ref={sizerRef} style={SizerStyles}>
        {inputProps.value || placeholderText}
      </div>
    </div>
  )
}
