const ReplaceRegExp = /%value%/

export function replacePlaceholder(string: string, value: string): string {
  return string.replace(ReplaceRegExp, value)
}
