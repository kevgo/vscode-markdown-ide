import * as vscode from "vscode"

import { markdownLinkCompletionProvider } from "./autocomplete-links/markdown-link-provider"
import { fileDeletedHandler } from "./file-deleted/file-deleted-handler"
import { fileRenamedHandler } from "./file-renamed/file-renamed-handler"
import { removeLeadingPounds } from "./helpers/remove-leading-pounds"

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

  // rename document title
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.renameDocumentTitle", renameTitle))
}

export async function renameTitle(): Promise<void> {
  const titleLine = vscode.window.activeTextEditor?.document.lineAt(0)
  if (!titleLine) {
    // document doesn't have content
    return
  }
  const oldTitle = removeLeadingPounds(titleLine.text)
  const newTitle = await vscode.window.showInputBox({ value: oldTitle })
  if (newTitle === undefined) {
    // user aborted with ESC
    return
  }
  console.log(newTitle)
}
