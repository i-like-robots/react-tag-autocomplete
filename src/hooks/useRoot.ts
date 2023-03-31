import React, { useContext, useMemo, useRef, useState } from 'react'
import { GlobalContext } from '../contexts'
import { labelId, rootId } from '../lib'
import type { OnBlur, OnFocus } from '../sharedTypes'

export type UseRootArgs = {
  onBlur?: OnBlur
  onFocus?: OnFocus
}

export type UseRootState = {
  isActive: boolean
  rootProps: React.ComponentPropsWithRef<'div'>
}

export function useRoot({ onBlur, onFocus }: UseRootArgs): UseRootState {
  const [isActive, setIsActive] = useState<boolean>(false)
  const { id, inputRef } = useContext(GlobalContext)
  const rootRef = useRef<HTMLDivElement>(null)

  const rootProps = useMemo(() => {
    return {
      'aria-describedby': labelId(id),
      id: rootId(id),
      onFocus() {
        setIsActive(true)
        onFocus?.()
      },
      onBlur() {
        if (!rootRef.current?.contains(document.activeElement)) {
          setIsActive(false)
          onBlur?.()
        }
      },
      onClick() {
        // Ensures that clicking on any non-interactive part of the component will focus the input
        if (document.activeElement === rootRef.current) {
          inputRef.current?.focus()
        }
      },
      ref: rootRef,
      tabIndex: -1,
    }
  }, [inputRef, id, onBlur, onFocus, rootRef])

  return {
    isActive,
    rootProps,
  }
}
