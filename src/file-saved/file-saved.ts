import * as path from "path"
import * as vscode from "vscode"

import { Settings } from "../configuration"
import * as tiki from "../tikibase"

/** provides a callback function to provide to vscode.workspace.onDidSaveTextDocument */
export function createCallback(
  args: { config: Settings; debug: vscode.OutputChannel; workspacePath: string }
): () => Promise<void> {
  const diagnosticsCollection = vscode.languages.createDiagnosticCollection("Markdown IDE")
  return async function() {
    if (!args.config.tikibaseEnabled()) {
      diagnosticsCollection.clear()
      return
    }
    // Note: running all lengthy operations upfront
    // so that we can clear and re-populate the collection as quickly as possible
    // and avoid flickering on screen
    const output = await tiki.check(args.workspacePath, args.debug)
    const files_diagnostics: Map<vscode.Uri, vscode.Diagnostic[]> = new Map()
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
      files_diagnostics.set(vscode.Uri.file(path.join(args.workspacePath, file)), diagnostics)
    }
    diagnosticsCollection.clear()
    for (const [uri, diag] of files_diagnostics.entries()) {
      diagnosticsCollection.set(uri, diag)
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
