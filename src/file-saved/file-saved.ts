import * as path from "path"
import * as util from "util"
import * as vscode from "vscode"

import { groupByFile } from "./group-by-file"
import * as tikibase from "./tikibase"

type Listener = () => void

/** provides a callback function to provide to vscode.workspace.onDidSaveTextDocument */
export function createCb(args: { debug: vscode.OutputChannel; workspacePath: string }): Listener {
  const handler = new SaveEventHandler(args)
  return handler.fileSaved.bind(handler)
}

/** collection of state and logic around handling onDidSaveTextDocument events in VSCode */
class SaveEventHandler {
  readonly collection: vscode.DiagnosticCollection
  readonly debug: vscode.OutputChannel
  readonly workspacePath: string

  a = 1
  constructor(args: { debug: vscode.OutputChannel; workspacePath: string }) {
    this.collection = vscode.languages.createDiagnosticCollection("Markdown IDE")
    this.debug = args.debug
    this.workspacePath = args.workspacePath
  }

  async fileSaved() {
    const messages = await tikibase.run({ debug: this.debug, opts: { cwd: this.workspacePath } })
    // const issues =
    this.collection.clear()
    const grouped = groupByFile(messages)
    grouped.forEach((messages, file) => {
      this.debug.appendLine(`FILE: ${file}, MESSAGES: ${util.inspect(messages)}`)
      const fullPath = path.join(this.workspacePath, file)
      const uri = vscode.Uri.file(fullPath)
      const diagnostics: vscode.Diagnostic[] = messages.map((message) => {
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
