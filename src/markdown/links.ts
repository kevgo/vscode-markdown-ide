import * as vscode from "vscode"
import * as line from "../text/lines"

// helper functions for Markdown links

/** creates a Markdown link to the file with the given name and content */
export function create(args: {
  /** vscode debug channel to print user guidance if the titleRE is wrong */
  debug?: vscode.OutputChannel | null
  fileContent: string
  filePath: string
  /** the regex to extract parts of the title */
  titleRE?: RegExp | undefined
}): string {
  const titleLine = remove(line.removeLeadingPounds(line.first(args.fileContent)))
  const result = `[${titleLine}](${args.filePath})`
  if (!args.titleRE) {
    return result
  }
  const match = args.titleRE.exec(titleLine)
  if (!match) {
    return result
  }
  if (match.length < 2) {
    args.debug?.appendLine(
      `Error in configuration setting "autocompleteTitleRegex": the regular expression "${args.titleRE}" has no capture group`
    )
    args.debug?.show()
    return result
  }
  if (match.length > 2) {
    args.debug?.appendLine(
      `Error in configuration setting "autocompleteTitleRegex":  the regular expression "${args.titleRE}" has too many capture groups`
    )
    args.debug?.show()
    return result
  }
  return `[${match[1]}](${args.filePath})`
}

/** provides the target of the Markdown link around the given cursor position in the given text */
export function extractTarget(lineText: string, cursorColumn: number): string | undefined {
  // go left from the cursor until we find the beginning of the Markdown link
  let start = cursorColumn
  while (start >= 0 && lineText[start] !== "[") {
    start--
  }
  if (start === -1) {
    // didn't find the link beginning on the left of the cursor --> search to the right
    start = cursorColumn
    while (start <= lineText.length && lineText[start] !== "[") {
      start++
    }
  }
  if (start === lineText.length + 1) {
    return
  }
  // keep going right until we find the start of the URL segment of the Markdown link
  while (start <= lineText.length && lineText[start] !== "(") {
    start++
  }
  if (start === lineText.length + 1) {
    return
  }
  // keep going right until we find the end of the URL segment of the Markdown link
  let end = start
  while (end <= lineText.length && lineText[end] !== ")") {
    end++
  }
  if (end === lineText.length + 1) {
    return
  }
  return lineText.substring(start + 1, end)
}

/** removes all links from the given Markdown text*/
export function remove(text: string): string {
  for (const match of text.match(linkRE) || []) {
    text = text.replace(match, titleRE.exec(match)?.[1] || "")
  }
  return text
}
const linkRE = /\[[^\]]*\]\([^)]*\)/g
const titleRE = /\[([^\]]*)\]/

/** removes all links to the given target from the given text */
export function removeWithTarget(args: { target: string; text: string }): string {
  return args.text.replace(
    new RegExp(`\\[(.*?)\\]\\(${args.target}\\)`, "g"),
    "$1"
  )
}

/** replaces the given oldTarget in all Markdown links of the given text with the newTarget */
export function replaceTarget(args: { newTarget: string; oldTarget: string; text: string }): string {
  return args.text.replace(
    new RegExp(`\\[(.*?)\\]\\(${args.oldTarget}\\)`, "g"),
    `[$1](${args.newTarget})`
  )
}

/** replaces the given oldTitle in all links with the given oldTitle and target in the given text with the given newTitle */
export function replaceTitle(args: { newTitle: string; oldTitle: string; target: string; text: string }): string {
  return args.text.replace(
    // NOTE: need regex here to replace all matches
    new RegExp(`\\[${args.oldTitle}\\]\\(${args.target}\\)`, "g"),
    `[${args.newTitle}](${args.target})`
  )
}
