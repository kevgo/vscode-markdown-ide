import { promises as fs } from "fs"
import { posix as path } from "path"

import { firstLine } from "../helpers/first-line"
import { removeLeadingPounds } from "../helpers/remove-leading-pounds"

export async function makeMdLinks(
  dir: string,
  document: string,
  allFiles: string[],
  searchTerm: string
): Promise<string[]> {
  const result: string[] = []
  for (const filename of allFiles) {
    if (!filename.startsWith(searchTerm)) {
      continue
    }
    const filePath = path.join(dir, filename)
    const content = await fs.readFile(filePath, "utf8")
    const relativeFile = path.relative(path.dirname(document), filePath)
    result.push(makeMdLink(relativeFile, content))
  }
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

export function makeMdLink(fileName: string, fileContent: string): string {
  return `[${removeLeadingPounds(firstLine(fileContent))}](${fileName})`
}

export function makeImgLink(fileName: string): string {
  return `[](${fileName})`
}
