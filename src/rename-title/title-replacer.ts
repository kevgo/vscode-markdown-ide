/** a function that replaces all occurrences of a preconfigured RegExp in the given string */
type Replacer = (text: string) => string

/**
 * provides a Replacer for links containing the given old title and target
 * with a link containing the given new title and target
 */
export function create(args: { newTitle: string; oldTitle: string; target: string }): Replacer {
  const re = new RegExp(`\\[${args.oldTitle}\\]\\(${args.target}\\)`, "g")
  const replacement = `[${args.newTitle}](${args.target})`
  return function(text: string): string {
    return text.replace(re, replacement)
  }
}
