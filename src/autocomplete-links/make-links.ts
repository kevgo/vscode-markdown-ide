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
  const filePromises: Array<{ content: Promise<string>; fullPath: string }> = []
  for (const relativeFilePath of args.relativeFilePaths) {
    const fullPath = path.join(args.wsRoot, relativeFilePath)
    filePromises.push({
      fullPath,
      content: fs.readFile(fullPath, "utf-8")
    })
  }
  const documentDir = path.dirname(args.document)
  const result = []
  for (const file of filePromises) {
    result.push(links.markdown({
      fileName: path.relative(documentDir, file.fullPath),
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
