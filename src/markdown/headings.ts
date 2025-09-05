import slugify from "@sindresorhus/slugify"
import * as vscode from "vscode"
import * as markdownHeadings from "../markdown/headings"
import * as lines from "../text/lines"

/** provides all headings in the given file content */
export function find(text: string, headings: Set<string>) {
  const matches = text.matchAll(headingRE)
  if (!matches) {
    return
  }
  for (const match of matches) {
    headings.add(match[1])
  }
}
const headingRE = /\n(##+ [^\n]+)/g

/** indicates whether this line matches the given link target */
export function matchesTarget(args: { line: string; target: string }): boolean {
  if (!args.line.startsWith("#")) {
    return false
  }
  const slug = slugify(lines.removeLeadingPounds(args.line).trim())
  return slug === args.target
}

/** provides the line in the given text to which the given target points */
export function locateAnchor(args: { target: string; text: string }): vscode.Position | undefined {
  for (const [i, line] of args.text.split(/\r?\n/).entries()) {
    if (markdownHeadings.matchesTarget({ line, target: args.target })) {
      return new vscode.Position(i, 0)
    }
  }
}
