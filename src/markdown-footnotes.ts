/** provides all footnotes in the given file content */
export function footnotes(text: string): string[] {
  let result: Set<string> = new Set()
  const matches = text.matchAll(footnoteRE)
  if (!matches) {
    return []
  }
  for (const match of matches) {
    result.add(match[1].substring(1))
  }
  return Array.from(result)
}

const footnoteRE = /\n(\[\^.+?\]):/g
