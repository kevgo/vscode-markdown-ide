// helper functions for lines of text.

/** provides the number of lines in the given text */
export function count(text: string): number {
  return (text.match(newLineRE) || []).length + 1
}
const newLineRE = /\n/g

/** provides the first line of the given text */
export function first(text: string): string {
  // NOTE: implemented as a for low-level loop for performance reasons
  for (let i = 0; i < text.length; i++) {
    if (text[i] == "\n") {
      return text.substring(0, i)
    }
  }
  return text
}

/** provides the content of the given line with leading # removed */
export function removeLeadingPounds(line: string): string {
  // NOTE: implemented as a for low-level loop for performance reasons
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c !== "#" && c !== " ") {
      return line.substring(i)
    }
  }
  return ""
}
