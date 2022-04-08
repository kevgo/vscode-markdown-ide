import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

export interface TikibaseConfig {
  titleRegEx?: string
}

export class Tikibase {
  private config: TikibaseConfig

  constructor(config: TikibaseConfig) {
    this.config = config
  }

  /** provides the titleRegEx setting as a proper regular expression */
  titleRegex(): RegExp | undefined {
    if (this.config.titleRegEx) {
      return new RegExp(this.config.titleRegEx)
    }
  }
}

/** provides the Tikibase configuration */
export async function tikibase(wsRoot: string): Promise<Tikibase | undefined> {
  let text = ""
  try {
    text = await fs.readFile(path.join(wsRoot, "tikibase.json"), "utf8")
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
