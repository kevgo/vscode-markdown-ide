import { promises as fs } from "fs"
import * as path from "path"

// helper functions for file extensions

const imgExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", "tiff"]

/** provides the filenames of all images in the given directory */
export async function images(dir: string): Promise<string[]> {
  return (await fs.readdir(dir)).filter(isImage)
}

/** indicates whether the given filename belongs to an image file */
export function isImage(fileName: string): boolean {
  return imgExtensions.some((ext) => fileName.endsWith(ext))
}

/** provides the relative path of all Markdown files in the given root folder */
export async function markdown(root: string, subFolder = ""): Promise<string[]> {
  // NOTE: this method scans subfolders concurrently to reduce latency of the interactive autocomplete dialog.
  const result: string[] = []
  const folderPromises: Array<Promise<string[]>> = []
  for (const file of await fs.readdir(path.join(root, subFolder))) {
    if (file.startsWith(".") || IGNORE.includes(file)) {
      continue
    }
    const relFilePath = path.join(subFolder, file)
    if (file.endsWith(".md")) {
      result.push(relFilePath)
      continue
    }
    const absFilePath = path.join(root, relFilePath)
    const fileInfo = await fs.stat(absFilePath)
    if (fileInfo.isDirectory()) {
      folderPromises.push(markdown(root, relFilePath))
    }
  }
  for (const folderPromise of folderPromises) {
    result.push(...(await folderPromise))
  }
  return result
}
const IGNORE = [".git", "node_modules", "vendor"]
