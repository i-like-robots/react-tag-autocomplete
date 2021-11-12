export function isCaretAtStart(target: HTMLInputElement): boolean {
  return target.selectionStart === 0 && target.selectionEnd === 0
}

export function isCaretAtEnd(target: HTMLInputElement): boolean {
  const length = target.value.length
  return target.selectionStart === length && target.selectionEnd === length
}
