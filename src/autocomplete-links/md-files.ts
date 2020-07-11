import { promises as fs, readdirSync, statSync } from "fs"
import * as path from "path"

const ignore = [".git", "node_modules", "vendor"]

// getFiles provides
export async function mdFiles(root: string, subFolder = ""): Promise<string[]> {
  const result: string[] = []
  for (const file of await fs.readdir(path.join(root, subFolder))) {
    if (file.startsWith(".") || ignore.includes(file)) {
      continue
    }
    const relFilePath = path.join(subFolder, file)
    const absFilePath = path.join(root, relFilePath)
    const fileInfo = await fs.stat(absFilePath)
    if (fileInfo.isDirectory()) {
      const files = await mdFiles(root, relFilePath)
      result.push(...files)
    } else {
      if (file.endsWith(".md")) {
        result.push(relFilePath)
      }
    }
  }
  return result
}
