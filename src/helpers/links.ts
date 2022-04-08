import * as vscode from "vscode"

import * as line from "../helpers/line"

// helper functions for Markdown links

/** creates a Markdown link to the given image */
export function image(fileName: string): string {
  return `[](${fileName})`
}

/** creates a Markdown link to the file with the given name and content */
export function markdown(args: {
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

/** removes all links in the given Markdown text*/
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
    new RegExp(`\\[${args.oldTitle}\\]\\(${args.target}\\)`, "g"),
    `[${args.newTitle}](${args.target})`
  )
}
