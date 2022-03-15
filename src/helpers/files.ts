import * as path from "path"
import * as vscode from "vscode"

const ignoreGlob = "{.git,node_modules,vendor}"

/** provides the relative filenames of all images in the current workspace */
export async function images(): Promise<string[]> {
  return makeRelative(await vscode.workspace.findFiles("**/*.{jpg,jpeg,png,gif,bmp,tif,tiff}", ignoreGlob))
}

/** provides the relative path of all Markdown files in the current workspace */
export async function markdown(): Promise<string[]> {
  return makeRelative(await vscode.workspace.findFiles("**/*.md", ignoreGlob))
}

/** converts the given list of VSCode URIs into file paths relative to the workspace root */
function makeRelative(files: vscode.Uri[]): string[] {
  const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath
  if (root == undefined) {
    return []
  }
  // NOTE: Using a for loop here because it is faster than map operations
  //       and we could be iterating many thousands of entries here.
  const result = []
  for (const file of files) {
    result.push(path.relative(root, file.fsPath))
  }
  return result
}
