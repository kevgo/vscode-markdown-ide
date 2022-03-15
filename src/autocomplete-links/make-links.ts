import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import * as links from "../helpers/links"

export async function makeMdLinks(args: {
  debug: vscode.OutputChannel
  document: string
  relativeFilePaths: string[]
  titleRE: RegExp | null
  wsRoot: string
}): Promise<string[]> {
  // NOTE: for performance reasons, we start loading all file contents concurrently first
  // and then assemble the result as the individual file contents become available.
  const filePromises: Array<{ content: Promise<string>; relativePath: string }> = []
  for (const relativeFilePath of args.relativeFilePaths) {
    filePromises.push({
      relativePath: relativeFilePath,
      content: fs.readFile(path.join(args.wsRoot, relativeFilePath), "utf-8")
    })
  }
  const result = []
  for (const file of filePromises) {
    result.push(links.markdown({
      fileName: path.relative(path.dirname(args.document), file.relativePath),
      fileContent: await file.content,
      debug: args.debug,
      titleRE: args.titleRE
    }))
  }
  return result
}

export function makeImgLinks(args: { filenames: string[]; searchTerm: string }): string[] {
  const result: string[] = []
  for (const filename of args.filenames) {
    if (!filename.startsWith(args.searchTerm)) {
      continue
    }
    result.push(links.image(filename))
  }
  return result
}
