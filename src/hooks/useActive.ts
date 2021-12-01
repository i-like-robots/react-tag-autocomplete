import React, { useCallback, useState } from 'react'

export type UseActiveProps = {
  containerRef: React.MutableRefObject<HTMLDivElement>
  inputRef: React.MutableRefObject<HTMLInputElement>
}

export type UseActiveState = {
  isActive: boolean
  containerProps: React.ComponentPropsWithRef<'div'>
}

export function useActive({ containerRef, inputRef }: UseActiveProps): UseActiveState {
  const [isActive, setIsActive] = useState<boolean>(false)

  const onFocus = useCallback(() => setIsActive(true), [])

  const onBlur = useCallback(() => {
    if (!containerRef.current?.contains(document.activeElement)) {
      setIsActive(false)
    }
  }, [containerRef])

  const onClick = useCallback(() => {
    if (document.activeElement === containerRef.current) {
      inputRef.current?.focus()
    }
  }, [containerRef, inputRef])

  return {
    isActive,
    containerProps: {
      onClick,
      onBlur,
      onFocus,
      ref: containerRef,
      tabIndex: -1,
    },
  }
}
