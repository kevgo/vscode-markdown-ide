import { promises as fs } from "fs"
import * as vscode from "vscode"

export interface Tikibase {
  titleRegEx?: string
}

/** provides the Tikibase configuration */
export async function tikibase(): Promise<Tikibase | undefined> {
  let text = ""
  try {
    text = await fs.readFile("tikibase.json", "utf8")
  } catch (e) {
    return
  }
  return JSON.parse(text) as Tikibase
}

/** provides the active VSCode workspace path */
export function workspacePath(): string | undefined {
  const currentFilePath = vscode.window.activeTextEditor?.document.uri.fsPath
  if (currentFilePath) {
    for (const wsFolder of vscode.workspace.workspaceFolders || []) {
      const wsPath = wsFolder.uri.fsPath
      if (currentFilePath.startsWith(wsPath)) {
        return wsPath
      }
    }
  }
  return vscode.workspace.workspaceFolders?.[0].uri.fsPath
}
