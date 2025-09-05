/** provides all headings in the given file content */
export function headings(text: string, headings: Set<string>) {
  const matches = text.matchAll(headingRE)
  if (!matches) {
    return
  }
  for (const match of matches) {
    headings.add(match[1])
  }
}
const headingRE = /\n(##+ [^\n]+)/g
