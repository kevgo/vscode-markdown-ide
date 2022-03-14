// helper functions for lines of text.

/** provides the number of lines in the given text */
export function count(text: string): number {
  return (text.match(newLineRE) || []).length + 1
}
const newLineRE = /\n/g

/** provides the first line of the given text */
export function first(text: string): string {
  return text.split("\n", 1)[0]
}

/** provides the content of the given line with leading # removed */
export function removeLeadingPounds(line: string): string {
  let i = 0
  while (line[i] === "#") {
    i++
  }
  return line.substr(i).trim()
}
