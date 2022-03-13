/**
 * provides a Replacer for links containing the given old title and target
 * with a link containing the given new title and target
 */
export function replaceLinkTitle(
  args: { newTitle: string; oldTitle: string; target: string; text: string }
): string {
  const re = new RegExp(`\\[${args.oldTitle}\\]\\(${args.target}\\)`, "g")
  const replacement = `[${args.newTitle}](${args.target})`
  return args.text.replace(re, replacement)
}
