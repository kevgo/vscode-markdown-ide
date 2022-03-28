import * as vscode from "vscode"

import { Configuration } from "./configuration"
import * as fileSaved from "./file-saved/file-saved"
import { filesDeleted } from "./files-deleted"
import { filesRenamed } from "./files-renamed"
import { markdownHeadingProvider } from "./markdown-heading-completion/markdown-heading-provider"
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
  const linksProvider = vscode.languages.registerCompletionItemProvider(
    "markdown",
    markdownLinkCompletionProvider(debug),
    "["
  )
  context.subscriptions.push(linksProvider)

  // autocomplete headings by typing `#`
  const headingsProvider = vscode.languages.registerCompletionItemProvider(
    "markdown",
    markdownHeadingProvider(debug),
    "#"
  )
  context.subscriptions.push(headingsProvider)

  // file renamed --> update links to this file
  vscode.workspace.onDidRenameFiles(filesRenamed)

  // file deleted --> remove links to this file
  vscode.workspace.onDidDeleteFiles(filesDeleted)

  // save file --> run Tikibase linter
  const fileSaveCb = fileSaved.createCallback({ debug, workspacePath })
  vscode.workspace.onDidSaveTextDocument(fileSaveCb)
  // run the linter now to show Markdown document issues on VSCode startup
  fileSaveCb()

  // rename document title --> update links with the old document title
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.renameDocumentTitle", renameTitle))
}
