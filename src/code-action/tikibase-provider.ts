import * as vscode from "vscode"

export class TikibaseProvider implements vscode.CodeActionProvider {
  /** name of the code action that this provider implements */
  public static readonly autofixCommand = "vscode-markdown-ide.autofix"

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const result: vscode.CodeAction[] = []
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.code !== "tikibase.fixable") {
        continue
      }
      const action = new vscode.CodeAction("tikibase fix", vscode.CodeActionKind.QuickFix)
      action.command = {
        command: TikibaseProvider.autofixCommand,
        title: "let Tikibase fix this and all other problems"
      }
      action.diagnostics = [diagnostic]
      action.isPreferred = true
      result.push(action)
    }
    return result
  }
}
