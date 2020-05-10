const newLineRE = /\n/g
export function lineCount(text: string): number {
  return (text.match(newLineRE) || []).length + 1
}
