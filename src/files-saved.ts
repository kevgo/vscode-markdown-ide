import * as path from "path"
import * as vscode from "vscode"

import * as tikibaseExec from "./tikibase/execute"

/** provides a callback function to provide to vscode.workspace.onDidSaveTextDocument */
export function createCallback(
  args: { debug: vscode.OutputChannel; workspacePath: string }
): () => Promise<void> {
  const diagnosticsCollection = vscode.languages.createDiagnosticCollection("Markdown IDE")
  return async function() {
    // Note: running all lengthy operations upfront
    // so that we can clear and re-populate the collection as quickly as possible
    // and avoid flickering on screen
    const output = await tikibaseExec.check(args.workspacePath, args.debug)
    const files_diagnostics: Map<vscode.Uri, vscode.Diagnostic[]> = new Map()
    for (const [file, messages] of output) {
      const diagnostics: vscode.Diagnostic[] = []
      for (const message of messages) {
        if (message.line === undefined || message.start === undefined || message.end === undefined) {
          await vscode.window.showErrorMessage(`${message.file}: ${message.text}`)
          continue
        }
        diagnostics.push({
          range: new vscode.Range(message.line, message.start, message.line, message.end),
          message: message.text,
          severity: vscode.DiagnosticSeverity.Error,
          code: `tikibase.${fixability(message.fixable)}`
        })
      }
      files_diagnostics.set(vscode.Uri.file(path.join(args.workspacePath, file)), diagnostics)
    }
    diagnosticsCollection.clear()
    for (const [uri, diag] of files_diagnostics.entries()) {
      diagnosticsCollection.set(uri, diag)
    }
  }
}

function fixability(fixable: boolean): string {
  if (fixable) {
    return "fixable"
  } else {
    return "unfixable"
  }
}
