/** provides all headings in the given file content */
export function inText(text: string): string[] {
  const matches = text.matchAll(footnoteRE)
  let result: Set<string> = new Set()
  if (!matches) {
    return []
  }
  for (const match of matches) {
    result.add(match[1].substring(1))
  }
  return Array.from(result)
}

const footnoteRE = /\n(\[\^.+?\]):/g
