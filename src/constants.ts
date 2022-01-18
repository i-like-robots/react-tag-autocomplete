export const KeyNames = {
  Enter: 'Enter',
  Escape: 'Escape',
  Tab: 'Tab',
  Backspace: 'Backspace',
  UpArrow: 'ArrowUp',
  UpArrowCompat: 'Up',
  DownArrow: 'ArrowDown',
  DownArrowCompat: 'Down',
}

export const CreateNewOptionValue = Symbol('Create new tag')

// <https://stackoverflow.com/questions/59939931/stop-dashlane-auto-fill-on-specific-input-fields>
export const DisableAutoComplete = {
  autoComplete: 'off',
  'data-form-type': 'other',
}

export const VoidFn = (): void => undefined
