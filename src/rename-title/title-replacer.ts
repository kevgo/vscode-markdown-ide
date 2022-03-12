/** a function that replaces all occurrences of a preconfigured RegExp in the given string */
type Replacer = (text: string) => string

/**
 * provides a Replacer for links containing the given old title and target
 * with a link containing the given new title and target
 */
export function create(oldTitle: string, target: string, newTitle: string): Replacer {
  const re = new RegExp(`\\[${oldTitle}\\]\\(${target}\\)`, "g")
  const replacement = `[${newTitle}](${target})`
  return function(text: string): string {
    return text.replace(re, replacement)
  }
}
