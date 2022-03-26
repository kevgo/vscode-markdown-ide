import * as path from "path"
import * as vscode from "vscode"

import * as tikibase from "./tikibase"

/** provides a callback function to provide to vscode.workspace.onDidSaveTextDocument */
export function createCallback(args: { debug: vscode.OutputChannel; workspacePath: string }): () => void {
  const manager = new SaveEventManager(args)
  return manager.fileSaved.bind(manager)
}

/** collection of state and logic around handling onDidSaveTextDocument events in VSCode */
class SaveEventManager {
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
      const diagnostics: vscode.Diagnostic[] = messagesForFile.map((message: tikibase.Message) => {
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
