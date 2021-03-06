/** describes a replacement of a regex with given text */
interface Replacement {
  readonly regex: RegExp
  readonly text: string
}

/**
 * replaces occurrences of the given filenames inside Markdown links to the given new filenames.
 * Call `register` to define the replacements, then `process` to replace them in a file content.
 */
export class LinkRemovers {
  private readonly replacements: Replacement[]

  constructor() {
    this.replacements = []
  }

  // registers a new replacement from old to new
  register(fileName: string): void {
    this.replacements.push({
      regex: new RegExp(`\\[(.*?)\\]\\(${fileName}\\)`, "g"),
      text: `$1`,
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
