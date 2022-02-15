import type { Tag } from '../sharedTypes'

const Whitespace = /\s+/g

export function tagToKey(tag: Tag): string {
  return `${String(tag.value)}-${tag.label}`
}

export function tagToId(tag: Tag): string {
  return tagToKey(tag).replace(Whitespace, '_')
}

export function findTagIndex(tag: Tag, tags: Tag[]): number {
  return tags.findIndex(({ value }) => value === tag.value)
}
