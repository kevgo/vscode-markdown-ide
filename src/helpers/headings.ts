/** provides all headings in the given file content */
export function inFile(text: string, headings: Set<string>) {
  const matches = text.matchAll(headingRE)
  for (const match of matches || []) {
    headings.add(match[1])
  }
}
const headingRE = /\n(##+ [^\n]+)/g
