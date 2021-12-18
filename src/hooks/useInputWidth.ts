import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { InternalRefs } from '../contexts'
import type React from 'react'

const SizerStyles: React.CSSProperties = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  overflow: 'scroll',
  whiteSpace: 'pre',
}

const StyleProps: Array<keyof React.CSSProperties> = [
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'textTransform',
]

export type UseInputWidthArgs = {
  allowResize: boolean
  value: string
}

export type UseInputWidthState = {
  width: number
  sizerProps: React.ComponentPropsWithRef<'div'>
}

export function useInputWidth({
  allowResize = true,
  value,
}: UseInputWidthArgs): UseInputWidthState {
  const { inputRef } = useContext(InternalRefs)

  const sizerRef = useRef<HTMLDivElement>()
  const [width, setWidth] = useState(0)

  const updateInputWidth = useCallback(() => {
    // scrollWidth is designed to be fast not accurate.
    // +2 is completely arbitrary but does the job.
    const newInputWidth = Math.ceil(sizerRef.current.scrollWidth) + 2

    if (width !== newInputWidth) {
      setWidth(newInputWidth)
    }
  }, [width, sizerRef])

  useEffect(() => {
    const inputStyle = window.getComputedStyle(inputRef.current)

    StyleProps.forEach((prop) => {
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
  }, [allowResize, updateInputWidth, value])

  return {
    width,
    sizerProps: {
      ref: sizerRef,
      style: SizerStyles,
    },
  }
}
