import { promises as fs } from "fs"
import * as path from "path"

// import * as vscode from "vscode"

// /** provides the relative filenames of all images in the current workspace */
// export async function images(): Promise<string[]> {
//   return makeRelative(await vscode.workspace.findFiles("**/*.{jpg,jpeg,png,gif,bmp,tif,tiff}", ignoreGlob))
// }

// /** provides the relative path of all Markdown files in the current workspace */
// export async function markdown(): Promise<string[]> {
//   return makeRelative(await vscode.workspace.findFiles("**/*.md", ignoreGlob))
// }

// /** converts the given list of VSCode URIs into file paths relative to the workspace root */
// function makeRelative(files: vscode.Uri[]): string[] {
//   const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath
//   if (root == undefined) {
//     return []
//   }
//   // NOTE: Using a for loop here because it is faster than map operations
//   //       and we could be iterating many thousands of entries here.
//   const result = []
//   for (const file of files) {
//     result.push(path.relative(root, file.fsPath))
//   }
//   return result
// }

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
