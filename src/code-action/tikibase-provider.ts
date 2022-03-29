import * as vscode from "vscode"

export class TikibaseProvider implements vscode.CodeActionProvider {
  public static readonly command = "vscode-markdown-ide.command"

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
        command: TikibaseProvider.command,
        title: "let Tikibase fix all these problems",
        tooltip: "runs \"tikibase fix\""
      }
      action.diagnostics = [diagnostic]
      action.isPreferred = true
      result.push(action)
    }
    return result
  }
}
