import { promises as fs } from "fs"
import * as path from "path"

const IGNORE = [".git", "node_modules", "vendor"]

// mdFiles provides the relative path of all Markdown files in the given root folder
export async function mdFiles(root: string, subFolder = ""): Promise<string[]> {
  const result: string[] = []
  // NOTE: this method scans subfolders concurrently to reduce latency of the interactive autocomplete dialog.
  // This array contains the promises of those ongoing subfolder scans.
  const folderPromises: Array<Promise<string[]>> = []
  for (const file of await fs.readdir(path.join(root, subFolder))) {
    if (file.startsWith(".") || IGNORE.includes(file)) {
      continue
    }
    const relFilePath = path.join(subFolder, file)
    const absFilePath = path.join(root, relFilePath)
    const fileInfo = await fs.stat(absFilePath)
    if (fileInfo.isDirectory()) {
      folderPromises.push(mdFiles(root, relFilePath))
    } else {
      if (file.endsWith(".md")) {
        result.push(relFilePath)
      }
    }
  }
  for (const folderPromise of folderPromises) {
    result.push(...(await folderPromise))
  }
  return result
}
