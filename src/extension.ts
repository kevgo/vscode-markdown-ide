import * as vscode from "vscode"
import { markdownLinkCompletionProvider } from "./autocomplete-links/markdown-link-provider"
import { fileRenamedHandler } from "./file-renamed/file-renamed-handler"
import { fileDeletedHandler } from "./file-deleted/file-deleted-handler"

export function activate(context: vscode.ExtensionContext) {
  // autocomplete links by typing `[`
  const provider = vscode.languages.registerCompletionItemProvider("markdown", markdownLinkCompletionProvider, "[")
  context.subscriptions.push(provider)

  // file renamed --> update links
  vscode.workspace.onDidRenameFiles(fileRenamedHandler)

  // file deleted --> remove links to this file
  vscode.workspace.onDidDeleteFiles(fileDeletedHandler)
}
