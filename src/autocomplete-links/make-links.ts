import { promises as fs } from "fs"
import { posix as path } from "path"

import { firstLine } from "../helpers/first-line"
import { removeLeadingPounds } from "../helpers/remove-leading-pounds"
import { removeLink } from "../helpers/remove-link"

export async function makeMdLinks(
  dir: string,
  document: string,
  allFiles: string[],
  titleRE: RegExp | null
): Promise<string[]> {
  const result: string[] = []

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
  titleRE: RegExp | null
): string {
  const titleLine = firstLine(fileContent)
  let title = ""
  if (titleRE != null) {
    const match = titleRE.exec(titleLine)
    if (match == null) {
      title = removeLeadingPounds(titleLine)
    } else if (match.length < 2) {
      throw new Error(`no capture group in autocompleteTitleRegex (${titleRE})`)
    } else if (match.length > 2) {
      throw new Error(
        `too many capture groups in autocompleteTitleRegex (${titleRE})`
      )
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
