/** replaces the given oldTarget in all Markdown links of the given text with the newTarget */
export function replaceLinkTarget(text: string, oldTarget: string, newTarget: string): string {
  const regex = new RegExp(`\\[(.*?)\\]\\(${oldTarget}\\)`, "g")
  const replacement = `[$1](${newTarget})`
  return text.replace(regex, replacement)
}
