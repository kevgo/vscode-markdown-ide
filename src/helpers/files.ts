import { promises as fs } from "fs"
import * as path from "path"

const ignore = [".git", "node_modules", "vendor"]
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".tif", ".tiff"]

/** provides all Markdown files (filenames and promise of content) in the given root directory */
export async function markdownFast(root: string, result: FileResult[], subdir = ""): Promise<void> {
  const fullRoot = path.join(root, subdir)
  for (const entry of await fs.readdir(fullRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (ignore.includes(entry.name)) {
        continue
      }
      await markdownFast(root, result, entry.name)
    } else {
      if (!entry.name.endsWith(".md")) {
        continue
      }
      result.push({
        filePath: path.join(subdir, entry.name),
        content: fs.readFile(path.join(fullRoot, entry.name), "utf8")
      })
    }
  }
}

/** provides all Markdown files (filenames and promise of content) in the given root directory */
export async function imagesFast(root: string, result: string[], subdir = ""): Promise<void> {
  const fullRoot = path.join(root, subdir)
  for (const entry of await fs.readdir(fullRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (ignore.includes(entry.name)) {
        continue
      }
      await imagesFast(root, result, entry.name)
    } else {
      if (!isImage(entry.name)) {
        continue
      }
      result.push(path.join(subdir, entry.name))
    }
  }
}

/** indicates whether the given filename belongs to an image */
export function isImage(filename: string): boolean {
  for (const imageExt of imageExtensions) {
    if (filename.endsWith(imageExt)) {
      return true
    }
  }
  return false
}

export interface FileResult {
  content: Promise<string>
  filePath: string
}
