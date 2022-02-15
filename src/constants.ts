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

export const NoOptionValue = Symbol('No options')

// <https://stackoverflow.com/questions/59939931/stop-dashlane-auto-fill-on-specific-input-fields>
export const DisableAutoComplete = {
  autoComplete: 'off',
  autoCorrect: 'off',
  'data-form-type': 'other',
  spellCheck: false,
}

export const VoidFn = (): void => undefined
