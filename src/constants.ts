export const KeyNames = {
  Enter: 'Enter',
  Escape: 'Escape',
  Tab: 'Tab',
  Backspace: 'Backspace',
  UpArrow: 'ArrowUp',
  UpArrowCompat: 'Up',
  DownArrow: 'ArrowDown',
  DownArrowCompat: 'Down',
  PageDown: 'PageDown',
  PageUp: 'PageUp',
}

export const NewOptionValue = Symbol('Create new tag')

export const NoOptionsValue = Symbol('No options')

// <https://stackoverflow.com/questions/59939931/stop-dashlane-auto-fill-on-specific-input-fields>
export const DisableAutoComplete = {
  autoComplete: 'off',
  autoCorrect: 'off',
  'data-form-type': 'other',
  spellCheck: false,
}

export const VoidFn = (): void => undefined
