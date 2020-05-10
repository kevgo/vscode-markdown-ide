import { promises as fs } from "fs"
import { posix as path } from "path"
import { removeLeadingPounds } from "../helpers/remove-leading-pounds"
import { firstLine } from "../helpers/first-line"

export async function makeMdLinks(dir: string, filenames: string[], searchTerm: string): Promise<string[]> {
  const result: string[] = []
  for (const filename of filenames) {
    if (!filename.startsWith(searchTerm)) {
      continue
    }
    const content = await fs.readFile(path.join(dir, filename), "utf8")
    result.push(makeMdLink(filename, content))
  }
  return result
}

export async function makeImgLinks(dir: string, filenames: string[], searchTerm: string): Promise<string[]> {
  const result: string[] = []
  for (const filename of filenames) {
    if (!filename.startsWith(searchTerm)) {
      continue
    }
    const content = await fs.readFile(path.join(dir, filename), "utf8")
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
