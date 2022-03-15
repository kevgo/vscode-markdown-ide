import * as vscode from "vscode"

/** type-safe access to VSCode configuration */
export class Configuration {
  config: vscode.WorkspaceConfiguration

  constructor() {
    this.config = vscode.workspace.getConfiguration("markdownIDE")
  }

  /** provides the titleRegex setting */
  titleRegExp(): RegExp | undefined {
    const setting = this.config.get<string>("autocomplete.titleRegex")
    if (setting && setting.length > 0) {
      return new RegExp(setting)
    }
  }

  /** provides the active VSCode workspace path */
  workspacePath(): string | undefined {
    const currentFilePath = vscode.window.activeTextEditor?.document.uri.fsPath
    if (!currentFilePath) {
      return
    }
    for (const wsFolder of vscode.workspace.workspaceFolders || []) {
      const wsPath = wsFolder.uri.fsPath
      if (currentFilePath.startsWith(wsPath)) {
        return wsPath
      }
    }
  }
}
