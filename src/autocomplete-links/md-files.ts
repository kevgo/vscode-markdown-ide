import { promises as fs } from "fs"

// getFiles provides
export async function mdFiles(dir: string): Promise<string[]> {
  const result: string[] = []
  for (const file of await fs.readdir(dir)) {
    if (file.endsWith(".md")) {
      result.push(file)
    }
  }
  return result
}
