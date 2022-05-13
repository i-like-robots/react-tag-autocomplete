export function arrayDiff<T>(a: T[], b: T[]): T[] {
  if (a === b) {
    return []
  } else {
    return a.filter((item) => !b.includes(item))
  }
}
