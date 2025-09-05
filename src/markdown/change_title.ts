export function changeTitle(args: { eol: string; newTitle: string; oldTitle: string; text: string }): string {
  const lines = args.text.split(args.eol)
  const oldTitleLine = `# ${args.oldTitle}`
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(oldTitleLine)) {
      lines[i] = `# ${args.newTitle}`
      break
    }
  }
  return lines.join(args.eol)
}
