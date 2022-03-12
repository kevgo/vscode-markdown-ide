import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { firstLine } from "../helpers/first-line"
import { removeLeadingPounds } from "../helpers/remove-leading-pounds"
import { removeLink } from "../helpers/remove-link"

export async function makeMdLinks(
  dir: string,
  document: string,
  allFiles: string[],
  titleRE: RegExp | null,
  debug: vscode.OutputChannel | null
): Promise<string[]> {
  const result: string[] = []

  function linkToFile(
    filePath: string,
    debug: vscode.OutputChannel | null,
    content: string
  ): void {
    const relativeFile = path.relative(path.dirname(document), filePath)
    result.push(makeMdLink(relativeFile, content, debug, titleRE))
  }
  const operations = allFiles
    .map((filename) => path.join(dir, filename))
    .map((filePath) =>
      fs
        .readFile(filePath, "utf-8")
        .then(linkToFile.bind(null, filePath, debug))
    )
  await Promise.all(operations)
  return result
}

export function makeImgLinks(
  dir: string,
  filenames: string[],
  searchTerm: string
): string[] {
  const result: string[] = []
  for (const filename of filenames) {
    if (!filename.startsWith(searchTerm)) {
      continue
    }
    result.push(makeImgLink(filename))
  }
  return result
}

export function makeMdLink(
  fileName: string,
  fileContent: string,
  debug: vscode.OutputChannel | null,
  titleRE: RegExp | null
): string {
  const titleLine = firstLine(fileContent)
  if (titleRE == null) {
    return `[${removeLink(removeLeadingPounds(titleLine))}](${fileName})`
  }
  const match = titleRE.exec(titleLine)
  if (match == null) {
    return `[${removeLink(removeLeadingPounds(titleLine))}](${fileName})`
  }
  if (match.length < 2) {
    debug?.appendLine(
      `Error in configuration setting "autocompleteTitleRegex": the regular expression "${titleRE}" has no capture group`
    )
    debug?.show()
    return `[${removeLink(removeLeadingPounds(titleLine))}](${fileName})`
  }
  if (match.length > 2) {
    debug?.appendLine(
      `Error in configuration setting "autocompleteTitleRegex":  the regular expression "${titleRE}" has too many capture groups`
    )
    debug?.show()
    return `[${removeLink(removeLeadingPounds(titleLine))}](${fileName})`
  }
  return `[${removeLink(match[1])}](${fileName})`
}

export function makeImgLink(fileName: string): string {
  return `[](${fileName})`
}
