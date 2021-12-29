import React, { useCallback, useContext, useState } from 'react'
import { GlobalContext } from '../contexts'

export type UseRootState = {
  isActive: boolean
  rootProps: React.ComponentPropsWithRef<'div'>
}

export function useRoot(): UseRootState {
  const [isActive, setIsActive] = useState<boolean>(false)

  const { id, inputRef, rootRef } = useContext(GlobalContext)

  const onFocus = useCallback(() => setIsActive(true), [])

  const onBlur = useCallback(() => {
    if (!rootRef.current?.contains(document.activeElement)) {
      setIsActive(false)
    }
  }, [rootRef])

  // Ensures that clicking on any non-interactive part of the component will focus the input
  const onClick = useCallback(() => {
    if (document.activeElement === rootRef.current) {
      inputRef.current?.focus()
    }
  }, [inputRef, rootRef])

  return {
    isActive,
    rootProps: {
      'aria-describedby': `${id}-label`,
      onBlur,
      onClick,
      onFocus,
      ref: rootRef,
      tabIndex: -1,
    },
  }
}
