import * as vscode from "vscode"

import { markdownLinkCompletionProvider } from "./autocomplete-links/markdown-link-provider"
import { fileDeletedHandler } from "./file-deleted/file-deleted-handler"
import { fileRenamedHandler } from "./file-renamed/file-renamed-handler"

export function activate(context: vscode.ExtensionContext): void {
  // autocomplete links by typing `[`
  const provider = vscode.languages.registerCompletionItemProvider(
    "markdown",
    markdownLinkCompletionProvider,
    "["
  )
  context.subscriptions.push(provider)

  // file renamed --> update links
  vscode.workspace.onDidRenameFiles(fileRenamedHandler)

  // file deleted --> remove links to this file
  vscode.workspace.onDidDeleteFiles(fileDeletedHandler)
}
