import * as vscode from "vscode"

/** Issue represents an issue that Tikibase found */
export interface Issue {
  diagnostics: vscode.Diagnostic[]
  file: vscode.Uri
}
