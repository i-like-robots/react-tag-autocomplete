import React, { useContext, useMemo, useState } from 'react'
import { GlobalContext } from '../contexts'
import { labelId, rootId } from '../lib'

export type UseRootState = {
  isActive: boolean
  rootProps: React.ComponentPropsWithRef<'div'>
}

export function useRoot(): UseRootState {
  const [isActive, setIsActive] = useState<boolean>(false)

  const { id, inputRef, rootRef } = useContext(GlobalContext)

  const rootProps = useMemo(() => {
    return {
      'aria-describedby': labelId(id),
      id: rootId(id),
      onFocus() {
        setIsActive(true)
      },
      onBlur() {
        if (!rootRef.current?.contains(document.activeElement)) {
          setIsActive(false)
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
  }, [inputRef, id, rootRef])

  return {
    isActive,
    rootProps,
  }
}
