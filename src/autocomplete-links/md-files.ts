import { promises as fs, readdirSync, statSync } from "fs"
import * as path from "path"

// getFiles provides
export async function mdFiles(
  dir: string,
  folders: string[] = []
): Promise<string[]> {
  const result: string[] = []
  for (const file of await fs.readdir(dir)) {
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
  return result
}
