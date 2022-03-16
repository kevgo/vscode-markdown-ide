import * as vscode from "vscode"

import * as tikibase from "./tikibase"

type Listener = (e: vscode.TextDocument) => any

/** provides a callback function to provide to vscode.workspace.onDidSaveTextDocument */
export function callback(args: { debug: vscode.OutputChannel; workspacePath: string }): Listener {
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
    const issues = await tikibase.run({ debug: this.debug, opts: { cwd: this.workspacePath } })
    this.collection.clear()
    for (const issue of issues) {
      this.collection.set(issue.file, issue.diagnostics)
    }
  }

  // updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
  //   if (document && path.extname(document.uri.fsPath) === ".md") {
  //     collection.set(document.uri, [{
  //       code: "",
  //       message: "cannot assign twice to immutable variable `x`",
  //       range: new vscode.Range(new vscode.Position(3, 4), new vscode.Position(3, 10)),
  //       severity: vscode.DiagnosticSeverity.Error,
  //       source: "",
  //       relatedInformation: [
  //         new vscode.DiagnosticRelatedInformation(
  //           new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))),
  //           "first assignment to `x`"
  //         )
  //       ]
  //     }])
  //   } else {
  //     collection.clear()
  //   }
  // }
}
