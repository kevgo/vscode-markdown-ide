import * as vscode from "vscode"

export class MarkdownRenameSymbolProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [vscode.CodeActionKind.Refactor]

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    if (!this.isFirstHeading(document, range)) {
      return []
    }

    const action = new vscode.CodeAction("Rename heading", vscode.CodeActionKind.Refactor)
    action.command = {
      command: "markdownIDE.renameSymbol",
      title: "Rename heading"
    }

    return [action]
  }

  private isFirstHeading(document: vscode.TextDocument, range: vscode.Range): boolean {
    const line = document.lineAt(range.start.line)

    // Check if we're on the first line and it's a heading
    if (range.start.line !== 0) {
      return false
    }

    // Check if the line starts with # (heading marker)
    const text = line.text.trim()
    return text.startsWith("#") && text.includes(" ")
  }
}
