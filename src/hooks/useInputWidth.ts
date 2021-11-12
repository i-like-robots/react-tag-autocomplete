import React, { useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

const STYLE_PROPS: Array<keyof CSSProperties> = [
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'textTransform',
]

export type UseInputWidthProps = {
  allowResize: boolean
  inputRef: React.MutableRefObject<HTMLInputElement>
  placeholderText: string
  sizerRef: React.MutableRefObject<HTMLDivElement>
  value: string
}

export function useInputWidth({
  allowResize = true,
  inputRef,
  placeholderText,
  sizerRef,
  value,
}: UseInputWidthProps): number {
  const [inputWidth, setInputWidth] = useState(0)

  const updateInputWidth = useCallback(() => {
    // scrollWidth is designed to be fast not accurate.
    // +2 is completely arbitrary but does the job.
    const newInputWidth = Math.ceil(sizerRef.current.scrollWidth) + 2

    if (inputWidth !== newInputWidth) {
      setInputWidth(newInputWidth)
    }
  }, [inputWidth, sizerRef])

  useEffect(() => {
    const inputStyle = window.getComputedStyle(inputRef.current)

    STYLE_PROPS.forEach((prop) => {
      sizerRef.current.style[prop] = inputStyle[prop]
    })

    if (allowResize) {
      updateInputWidth()
    }
  })

  useEffect(() => {
    if (allowResize) {
      updateInputWidth()
    }
  }, [allowResize, placeholderText, updateInputWidth, value])

  return allowResize ? inputWidth : null
}
