// helper functions for lines of text.

/** provides the number of lines in the given text */
export function count(text: string): number {
  return (text.match(newLineRE) || []).length + 1
}
const newLineRE = /\n/g

/** provides the first line of the given text */
export function first(text: string): string {
  let i = 0
  while (text[i] !== "\n" && i < text.length) {
    i++
  }
  return text.substring(0, i)
}

/** provides the content of the given line with leading # removed */
export function removeLeadingPounds(line: string): string {
  let i = 0
  while (line[i] === "#" && i < line.length) {
    i++
  }
  while (line[i] === " " && i < line.length) {
    i++
  }
  return line.substring(i)
}
