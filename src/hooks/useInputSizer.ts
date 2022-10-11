import React, { useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '../contexts'

const SizerStyles: React.CSSProperties = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  overflow: 'scroll',
  whiteSpace: 'pre',
}

const StyleProps: string[] = [
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'letter-spacing',
  'text-transform',
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
  const sizerRef = useRef<HTMLDivElement>(null)
  const { inputRef } = useGlobalContext()
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (inputRef.current) {
      const inputStyle = window.getComputedStyle(inputRef.current)

      StyleProps.forEach((prop) => {
        const value = inputStyle.getPropertyValue(prop)
        sizerRef.current?.style.setProperty(prop, value)
      })
    }
  }, [inputRef, sizerRef])

  useEffect(() => {
    if (allowResize) {
      // scrollWidth is designed to be fast not accurate.
      // +2 is completely arbitrary but does the job.
      const newWidth = Math.ceil(sizerRef.current?.scrollWidth ?? 0) + 2
      if (width !== newWidth) setWidth(newWidth)
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
