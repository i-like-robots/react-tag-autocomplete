import type { Tag } from '../sharedTypes'

export function tagToKey(tag: Tag): string {
  return `${String(tag.value)}-${tag.label}`
}

export function findTagIndex(tag: Tag, tags: Tag[]): number {
  return tags.findIndex(({ value }) => value === tag.value)
}
