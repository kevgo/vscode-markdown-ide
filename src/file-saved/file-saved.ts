import * as path from "path"
import * as vscode from "vscode"

import * as tikibase from "./tikibase"

/** provides a callback function to provide to vscode.workspace.onDidSaveTextDocument */
export function createCallback(args: { debug: vscode.OutputChannel; workspacePath: string }): () => void {
  const collection = vscode.languages.createDiagnosticCollection("Markdown IDE")
  return async function() {
    collection.clear()
    for (const [file, messages] of groupByFile(await tikibase.check(args.workspacePath, args.debug))) {
      const diagnostics: vscode.Diagnostic[] = []
      for (const message of messages) {
        diagnostics.push({
          range: new vscode.Range(message.line, message.start, message.line, message.end),
          message: message.text,
          severity: vscode.DiagnosticSeverity.Error,
          code: "tikibase.fixable" // TODO: apply only for fixable issues
        })
      }
      collection.set(vscode.Uri.file(path.join(args.workspacePath, file)), diagnostics)
    }
  }
}

/** organizes the given Tikibase messages by filename, i.e. in the structure VSCode needs */
export function groupByFile(messages: tikibase.Message[]): Map<string, tikibase.Message[]> {
  const result: Map<string, tikibase.Message[]> = new Map()
  for (const message of messages) {
    const messagesForFile = result.get(message.file)
    if (messagesForFile) {
      messagesForFile.push(message)
    } else {
      result.set(message.file, [message])
    }
  }
  return result
}
