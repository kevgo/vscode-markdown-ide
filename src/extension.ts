import * as vscode from "vscode"

import { Configuration } from "./configuration"
import * as fileSaved from "./file-saved/file-saved"
import { filesDeleted } from "./files-deleted"
import { filesRenamed } from "./files-renamed"
import { markdownLinkCompletionProvider } from "./markdown-link-completion/markdown-link-provider"
import { renameTitle } from "./rename-title"

export function activate(context: vscode.ExtensionContext): void {
  const config = new Configuration()
  const workspacePath = config.workspacePath()
  if (!workspacePath) {
    return
  }
  const debug = vscode.window.createOutputChannel("Markdown IDE")

  // autocomplete links by typing `[`
  const provider = vscode.languages.registerCompletionItemProvider(
    "markdown",
    markdownLinkCompletionProvider(debug),
    "["
  )
  context.subscriptions.push(provider)

  // file renamed --> update links to this file
  vscode.workspace.onDidRenameFiles(filesRenamed)

  // file deleted --> remove links to this file
  vscode.workspace.onDidDeleteFiles(filesDeleted)

  // save file --> run Tikibase linter
  const fileSaveCallback = fileSaved.createCb({ debug, workspacePath })
  vscode.workspace.onDidSaveTextDocument(fileSaveCallback)
  // run the linter now to show Markdown document issues on VSCode startup
  // @ts-ignore: fileSaveCallback doesn't need the current document
  fileSaveCallback(vscode.window.activeTextEditor?.document)

  // rename document title --> update links with the old document title
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.renameDocumentTitle", renameTitle))
}
