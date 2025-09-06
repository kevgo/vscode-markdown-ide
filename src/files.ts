import slugify from "@sindresorhus/slugify"
import { promises as fs } from "fs"
import * as path from "path"

const ignoreDirs = [".git", "node_modules", "vendor"]
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".tif", ".tiff"]

/**
 * Populates the accumulator argument with all Markdown files (filenames and promise of content) in the given root directory.
 *
 * This function is performance optimized because it affects the user-visible latency of the auto-complete popup.
 * The `accumulator` argument exists to avoid creating and merging temporary arrays.
 */
export async function markdown(root: string, accumulator: FileResult[] = [], subdir = ""): Promise<FileResult[]> {
  const fullRoot = path.join(root, subdir)
  for (const entry of await fs.readdir(fullRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (ignoreDirs.includes(entry.name)) {
        continue
      }
      await markdown(root, accumulator, path.join(subdir, entry.name))
    } else {
      if (!entry.name.endsWith(".md")) {
        continue
      }
      accumulator.push({
        filePath: path.join(subdir, entry.name),
        content: fs.readFile(path.join(fullRoot, entry.name), "utf8")
      })
    }
  }
  return accumulator
}

export interface FileResult {
  content: Promise<string>
  filePath: string
}

/**
 * Populates the accumulator argument with all image filenames in the given root directory.
 *
 * This function is performance optimized because it affects the user-visible latency of the auto-complete popup.
 * The `accumulator` argument exists to avoid creating and merging temporary arrays.
 */
export async function images(root: string, accumulator: string[], subdir = ""): Promise<void> {
  const fullRoot = path.join(root, subdir)
  for (const entry of await fs.readdir(fullRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (ignoreDirs.includes(entry.name)) {
        continue
      }
      await images(root, accumulator, path.join(subdir, entry.name))
    } else {
      if (!isImage(entry.name)) {
        continue
      }
      accumulator.push(path.join(subdir, entry.name))
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

/** provides the filename for a note with the given title */
export function mdFileName(title: string): string {
  let result = `${slugify(title)}`
  if (!result.endsWith(".md")) {
    result = result + ".md"
  }
  return result
}

export async function isFile(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath)
    return stats.isFile()
  } catch (e) {
    return false
  }
}
