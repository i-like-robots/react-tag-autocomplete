import type { Tag } from '../sharedTypes'

export function tagToKey(tag: Tag): string {
  return `${String(tag.value)}-${tag.label}`
}

export function tagsToKeys(tags: Tag[]): string[] {
  return tags.map(tagToKey)
}
