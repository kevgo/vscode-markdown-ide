import * as vscode from "vscode"

import { markdownLinkCompletionProvider } from "./autocomplete-links/markdown-link-provider"
import { filesDeleted } from "./files-deleted/files-deleted"
import { filesRenamed } from "./files-renamed/file-renamed"
import { renameTitle } from "./rename-title/rename-title"

export function activate(context: vscode.ExtensionContext): void {
  // autocomplete links by typing `[`
  const provider = vscode.languages.registerCompletionItemProvider(
    "markdown",
    markdownLinkCompletionProvider,
    "["
  )
  context.subscriptions.push(provider)

  // file renamed --> update links
  vscode.workspace.onDidRenameFiles(filesRenamed)

  // file deleted --> remove links to this file
  vscode.workspace.onDidDeleteFiles(filesDeleted)

  // rename document title
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.renameDocumentTitle", renameTitle))
}
