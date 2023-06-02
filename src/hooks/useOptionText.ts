import { partialRegExp, replacePlaceholder } from '../lib'
import { NewOptionValue, NoOptionsValue } from '../constants'
import type { TagOption } from '../sharedTypes'

function highlightText(text: string, query: string, template: string): string {
  const regexp = partialRegExp(query)
  return text.replace(regexp, template)
}

export type UseOptionTextProps = {
  option: TagOption
  query: string
  highlightTagName: JSX.IntrinsicElements
  highlightClassName: string
}

export function useOptionText({
  option,
  query,
  highlightTagName,
  highlightClassName,
}: UseOptionTextProps): string {
  if (option.value === NewOptionValue || option.value === NoOptionsValue) {
    return replacePlaceholder(option.label, query)
  }

  if (query) {
    const template = `<${highlightTagName} class=${highlightClassName}>$&</${highlightTagName}>`
    return highlightText(option.label, query, template)
  }

  return option.label
}
