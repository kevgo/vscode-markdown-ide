/**
 * LinkReplacers replaces occurrences of the given filenames inside Markdown links to the given new filenames.
 * Call `register` to define the replacements, then `process` to replace them in a file content.
 */
export class LinkTargetReplacer {
  /** collection of regex to replace --> text to replace it with */
  private readonly replacements: { readonly regex: RegExp; readonly text: string }[] = []

  // registers a new replacement from old to new
  register(oldTarget: string, newTarget: string): void {
    this.replacements.push({
      regex: new RegExp(`\\[(.*?)\\]\\(${oldTarget}\\)`, "g"),
      text: `[$1](${newTarget})`
    })
  }

  // applies all the registered replacements to the given text
  process(text: string): string {
    for (const replacement of this.replacements) {
      text = text.replace(replacement.regex, replacement.text)
    }
    return text
  }
}
