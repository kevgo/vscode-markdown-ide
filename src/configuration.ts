import * as vscode from "vscode"

/** type-safe access to the VSCode configuration of MarkdownIDE */
export class Settings {
  /** provides the Tikibase configuration entries */
  private tikiConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration("markdownIDE")
  }

  tikibaseEnabled(): boolean {
    return this.tikiConfig().get<boolean>("tikibase.enabled") ?? false
  }

  /** provides the titleRegex setting */
  titleRegExp(): RegExp | undefined {
    const setting = this.tikiConfig().get<string>("autocomplete.titleRegex")
    if (setting && setting.length > 0) {
      return new RegExp(setting)
    }
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
