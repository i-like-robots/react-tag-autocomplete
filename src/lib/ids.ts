import { tagToId } from '.'
import type { Tag } from '../sharedTypes'

export function rootId(id: string): string {
  return id
}

export function labelId(id: string): string {
  return `${id}-label`
}

export function comboBoxId(id: string): string {
  return `${id}-combobox`
}

export function inputId(id: string): string {
  return `${id}-input`
}

export function listBoxId(id: string): string {
  return `${id}-listbox`
}

export function optionId(id: string, tag: Tag): string {
  return `${id}-option-${tagToId(tag)}`
}
