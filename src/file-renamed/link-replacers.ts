// Replacement describes a replacement of a regex with given text.
interface Replacement {
  regex: RegExp
  text: string
}

// LinkReplacers replaces occurrences of the given filenames inside Markdown links to the given new filenames.
// Call `register` to define the replacements, then `process` to replace them in a file content.
export class LinkReplacers {
  private replacements: Replacement[]

  constructor() {
    this.replacements = []
  }

  // registers a new replacement from old to new
  register(oldName: string, newName: string): void {
    this.replacements.push({
      regex: new RegExp(`\\[(.*?)\\]\\(${oldName}\\)`, "g"),
      text: `[$1](${newName})`,
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
