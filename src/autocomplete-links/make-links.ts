import { promises as fs } from "fs"
import { posix as path } from "path"
import * as vscode from "vscode"

import { firstLine } from "../helpers/first-line"
import { removeLeadingPounds } from "../helpers/remove-leading-pounds"
import { removeLink } from "../helpers/remove-link"

export async function makeMdLinks(
  dir: string,
  document: string,
  allFiles: string[]
): Promise<string[]> {
  const result: string[] = []
  const config = vscode.workspace.getConfiguration("markdownIDE")
  const reS = config.get<string>("autocompleteTitleRegex") ?? "^#+ (.*)$"
  const titleRE = new RegExp(reS)

  function linkToFile(filePath: string, content: string): void {
    const relativeFile = path.relative(path.dirname(document), filePath)
    result.push(makeMdLink(relativeFile, content, titleRE))
  }
  const operations = allFiles
    .map((filename) => path.join(dir, filename))
    .map((filePath) =>
      fs.readFile(filePath, "utf-8").then(linkToFile.bind(null, filePath))
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
  titleRE: RegExp
): string {
  const titleLine = firstLine(fileContent)
  const match = titleRE.exec(titleLine)
  let title = ""
  if (match != null && match.length > 1) {
    title = match[1]
  } else {
    title = removeLeadingPounds(titleLine)
  }
  return `[${removeLink(title)}](${fileName})`
}

export function makeImgLink(fileName: string): string {
  return `[](${fileName})`
}
