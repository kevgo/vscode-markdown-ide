import * as path from "path"
import * as vscode from "vscode"

export function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
  if (document && path.extname(document.uri.fsPath) === ".md") {
    collection.set(document.uri, [{
      code: "",
      message: "cannot assign twice to immutable variable `x`",
      range: new vscode.Range(new vscode.Position(3, 4), new vscode.Position(3, 10)),
      severity: vscode.DiagnosticSeverity.Error,
      source: "",
      relatedInformation: [
        new vscode.DiagnosticRelatedInformation(
          new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))),
          "first assignment to `x`"
        )
      ]
    }])
  } else {
    collection.clear()
  }
}
