export function removeLeadingPounds(line: string): string {
  let i = 0
  while (line[i] === "#") {
    i++
  }
  return line.substr(i).trim()
}
