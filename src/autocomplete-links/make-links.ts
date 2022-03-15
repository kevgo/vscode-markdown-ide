import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import * as links from "../helpers/links"

export async function makeMdLinks(
  wsRoot: string,
  document: string,
  relativeFilePaths: string[],
  titleRE: RegExp | null,
  debug: vscode.OutputChannel
): Promise<string[]> {
  // NOTE: for performance reasons, we start loading all file contents concurrently first
  // and then assemble the result as the individual file contents become available.
  const filePromises: Array<{ content: Promise<string>; relativePath: string }> = []
  for (const relativeFilePath of relativeFilePaths) {
    filePromises.push({
      relativePath: relativeFilePath,
      content: fs.readFile(path.join(wsRoot, relativeFilePath), "utf-8")
    })
  }
  const result = []
  for (const file of filePromises) {
    result.push(links.markdown({
      fileName: path.relative(path.dirname(document), file.relativePath),
      fileContent: await file.content,
      debug,
      titleRE
    }))
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
    result.push(links.image(filename))
  }
  return result
}
