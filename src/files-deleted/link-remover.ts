/** removes all links to the given target from the given text */
export function removeLinkToTarget(text: string, target: string): string {
  const re = new RegExp(`\\[(.*?)\\]\\(${target}\\)`, "g")
  return text.replace(re, "$1")
}
