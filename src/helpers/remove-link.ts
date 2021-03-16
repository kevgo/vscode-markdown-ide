const linkRE = /\[[^\]]*\]\([^)]*\)/g
const titleRE = /\[([^\]]*)\]/
export function removeLink(text: string): string {
  let result = text
  const matches = text.match(linkRE)
  if (matches == null) {
    return text
  }
  for (const match of matches) {
    const title = titleRE.exec(match)
    if (title == null) {
      continue
    }
    result = result.replace(match, title[1])
  }
  return result
}
