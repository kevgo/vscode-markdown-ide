import * as path from "path"
import * as vscode from "vscode"

import * as tiki from "../tikibase"

/** provides a callback function to provide to vscode.workspace.onDidSaveTextDocument */
export function createCallback(args: { debug: vscode.OutputChannel; workspacePath: string }): () => void {
  const collection = vscode.languages.createDiagnosticCollection("Markdown IDE")
  return async function() {
    collection.clear()
    const output = await tiki.check(args.workspacePath, args.debug)
    for (const [file, messages] of groupByFile(output)) {
      const diagnostics: vscode.Diagnostic[] = []
      for (const message of messages) {
        diagnostics.push({
          range: new vscode.Range(message.line, message.start, message.line, message.end),
          message: message.text,
          severity: vscode.DiagnosticSeverity.Error,
          code: `tikibase.${fixability(message.fixable)}`
        })
      }
      collection.set(vscode.Uri.file(path.join(args.workspacePath, file)), diagnostics)
    }
  }
}

/** organizes the given Tikibase messages in the structure VSCode needs */
export function groupByFile(messages: tiki.Message[]): Map<string, tiki.Message[]> {
  const result: Map<string, tiki.Message[]> = new Map()
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

export function fixability(fixable: boolean): string {
  if (fixable) {
    return "fixable"
  } else {
    return "unfixable"
  }
}
