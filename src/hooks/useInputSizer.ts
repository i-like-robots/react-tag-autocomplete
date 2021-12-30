import React, { useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext } from '../contexts'

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

export type UseInputSizerArgs = {
  allowResize: boolean
  text: string
}

export type UseInputSizerState = {
  width: number
  sizerProps: React.ComponentPropsWithRef<'div'>
}

export function useInputSizer({ allowResize = true, text }: UseInputSizerArgs): UseInputSizerState {
  const sizerRef = useRef<HTMLDivElement>()
  const { inputRef } = useContext(GlobalContext)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const inputStyle = window.getComputedStyle(inputRef.current)

    StyleProps.forEach((prop) => {
      sizerRef.current.style[prop] = inputStyle[prop]
    })
  }, [inputRef, sizerRef])

  useEffect(() => {
    if (allowResize) {
      // scrollWidth is designed to be fast not accurate.
      // +2 is completely arbitrary but does the job.
      const newInputWidth = Math.ceil(sizerRef.current.scrollWidth) + 2
      if (width !== newInputWidth) setWidth(newInputWidth)
    }
  }, [allowResize, text, width])

  return {
    width,
    sizerProps: {
      ref: sizerRef,
      style: SizerStyles,
    },
  }
}
