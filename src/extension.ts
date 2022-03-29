import * as vscode from "vscode"

import { TikibaseActionProvider } from "./code-action/tikibase-provider"
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
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    "markdown",
    markdownLinkCompletionProvider(debug, workspacePath),
    "["
  ))

  // autocomplete headings by typing `#`
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
    "markdown",
    markdownHeadingProvider(debug, workspacePath),
    "#"
  ))

  // file renamed --> update links to this file
  vscode.workspace.onDidRenameFiles(filesRenamed)

  // file deleted --> remove links to this file
  vscode.workspace.onDidDeleteFiles(filesDeleted)

  // save file --> run "tikibase check"
  const runTikibaseCheck = fileSaved.createCallback({ debug, workspacePath })
  vscode.workspace.onDidSaveTextDocument(runTikibaseCheck)

  // startup --> run "tikibase check"
  runTikibaseCheck()

  // rename document title --> update links with the old document title
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.renameDocumentTitle", renameTitle))

  // "tikibase fix" code action
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("markdown", new TikibaseActionProvider(), {
      providedCodeActionKinds: TikibaseActionProvider.providedCodeActionKinds
    })
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-markdown-ide.command",
      () => vscode.window.showErrorMessage("HELLO!")
    )
  )
}
