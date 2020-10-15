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
  const filePaths = allFiles
    .filter((filename) => path.basename(filename).startsWith(searchTerm))
    .map((filename) => path.join(dir, filename))
  const fileContents = await Promise.all(
    filePaths.map((filePath) => fs.readFile(filePath, "utf-8"))
  )
  for (let i = 0; i < filePaths.length; i++) {
    const relativeFile = path.relative(path.dirname(document), filePaths[i])
    result.push(makeMdLink(relativeFile, fileContents[i]))
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
