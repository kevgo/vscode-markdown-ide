import * as path from "path"
import * as vscode from "vscode"

import { groupByFile } from "./group-by-file"
import * as tikibase from "./tikibase"

/** provides a callback function to provide to vscode.workspace.onDidSaveTextDocument */
export function createCallback(args: { debug: vscode.OutputChannel; workspacePath: string }): () => void {
  const handler = new SaveEventHandler(args)
  return handler.fileSaved.bind(handler)
}

/** collection of state and logic around handling onDidSaveTextDocument events in VSCode */
class SaveEventHandler {
  readonly collection: vscode.DiagnosticCollection
  readonly debug: vscode.OutputChannel
  readonly workspacePath: string

  constructor(args: { debug: vscode.OutputChannel; workspacePath: string }) {
    this.collection = vscode.languages.createDiagnosticCollection("Markdown IDE")
    this.debug = args.debug
    this.workspacePath = args.workspacePath
  }

  async fileSaved() {
    const errorMessages = await tikibase.run({ debug: this.debug, execOpts: { cwd: this.workspacePath } })
    this.collection.clear()
    groupByFile(errorMessages).forEach((messagesForFile, file) => {
      const uri = vscode.Uri.file(path.join(this.workspacePath, file))
      const diagnostics: vscode.Diagnostic[] = messagesForFile.map((message) => {
        return {
          range: new vscode.Range(message.line, message.start, message.line, message.end),
          message: message.text,
          severity: vscode.DiagnosticSeverity.Error
        }
      })
      this.collection.set(uri, diagnostics)
    })
  }
}