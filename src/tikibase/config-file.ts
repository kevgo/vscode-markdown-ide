import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

export interface TikibaseConfig {
  bidiLinks?: boolean
  sections?: string[]
  titleRegEx?: string
}

export class Tikibase {
  private config: TikibaseConfig

  constructor(config: TikibaseConfig) {
    this.config = config
  }

  bidiLinks(): boolean {
    return this.config.bidiLinks ?? false
  }

  sections(): string[] | undefined {
    return this.config.sections
  }

  /** provides the titleRegEx setting as a proper regular expression */
  titleRegex(): RegExp | undefined {
    if (this.config.titleRegEx) {
      try {
        return new RegExp(this.config.titleRegEx)
      } catch (e) {
        void vscode.window.showErrorMessage(`error parsing the regex "${this.config.titleRegEx}": ${e}`)
      }
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
  try {
    return new Tikibase(JSON.parse(text) as TikibaseConfig)
  } catch (e) {
    await vscode.window.showErrorMessage(`file tikibase.json contains invalid JSON: ${e}`)
  }
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
