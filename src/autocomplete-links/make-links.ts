import { promises as fs } from "fs"
import { posix as path } from "path"
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
  let title = ""
  if (titleRE != null) {
    const match = titleRE.exec(titleLine)
    if (match == null) {
      title = removeLeadingPounds(titleLine)
    } else if (match.length < 2) {
      debug?.appendLine(
        `Error in configuration setting "autocompleteTitleRegex": the regular expression "${titleRE}" has no capture group`
      )
      debug?.show()
      title = removeLeadingPounds(titleLine)
    } else if (match.length > 2) {
      debug?.appendLine(
        `Error in configuration setting "autocompleteTitleRegex":  the regular expression "${titleRE}" has too many capture groups`
      )
      debug?.show()
      title = removeLeadingPounds(titleLine)
    } else {
      title = match[1]
    }
  } else {
    title = removeLeadingPounds(titleLine)
  }
  return `[${removeLink(title)}](${fileName})`
}

export function makeImgLink(fileName: string): string {
  return `[](${fileName})`
}
