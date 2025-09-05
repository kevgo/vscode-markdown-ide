import * as vscode from "vscode"

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
