import { promises as fs } from "fs"
import * as path from "path"

const IGNORE = [".git", "node_modules", "vendor"]

// getFiles provides
export async function mdFiles(root: string, subFolder = ""): Promise<string[]> {
  const result: string[] = []
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
    const files = await folderPromise
    result.push(...files)
  }
  return result
}
