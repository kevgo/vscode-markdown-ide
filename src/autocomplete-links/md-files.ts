import { promises as fs, readdirSync, statSync } from "fs"
import * as path from "path"

const ignore = [".git", "node_modules"]

// getFiles provides
export async function mdFiles(
  dir: string,
  folders: string[] = []
): Promise<string[]> {
  const result: string[] = []
  for (const file of await fs.readdir(dir)) {
    if (ignore.includes(file)) {
      continue
    }
    const filePath = path.join(dir, file)
    const fileInfo = await fs.stat(filePath)
    if (fileInfo.isDirectory()) {
      folders.push(filePath)
      result.concat(await mdFiles(filePath, folders))
    } else {
      if (file.endsWith(".md")) {
        result.push(filePath)
      }
    }
  }
  console.log(dir, result)
  return result
}
