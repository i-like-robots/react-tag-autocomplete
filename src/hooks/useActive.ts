import { useCallback, useState } from 'react'
import type { FocusEvent, HTMLAttributes, MouseEvent } from 'react'

export type UseActiveProps = {
  containerRef: React.MutableRefObject<HTMLDivElement>
  inputRef: React.MutableRefObject<HTMLInputElement>
}

export type UseActiveState = {
  isActive: boolean
  containerProps: HTMLAttributes<HTMLElement>
}

export function useActive({ containerRef, inputRef }: UseActiveProps): UseActiveState {
  const [isActive, setIsActive] = useState<boolean>(false)

  const onFocus = useCallback(() => setIsActive(true), [])

  const onBlur = useCallback(
    (e: FocusEvent) => {
      if (!e.currentTarget || !containerRef.current?.contains(e.currentTarget)) {
        setIsActive(false)
      }
    },
    [containerRef]
  )

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (document.activeElement !== e.target) {
        inputRef.current?.focus()
      }
    },
    [inputRef]
  )

  return {
    isActive,
    containerProps: {
      onClick,
      onBlur,
      onFocus,
    },
  }
}
