import * as vscode from "vscode"

import { TikibaseProvider } from "./code-action/tikibase-provider"
import * as configuration from "./configuration"
import * as fileSaved from "./file-saved/file-saved"
import { filesDeleted } from "./files-deleted"
import { filesRenamed } from "./files-renamed"
import { MarkdownDefinitionProvider } from "./follow-link/follow-bidi-link"
import { markdownHeadingProvider } from "./markdown-heading-completion/markdown-heading-provider"
import { markdownLinkCompletionProvider } from "./markdown-link-completion/markdown-link-provider"
import { renameTitle } from "./rename-title/rename-title"
import * as tikibase from "./tikibase"

export function activate(context: vscode.ExtensionContext): void {
  const config = new configuration.Settings()
  const workspacePath = configuration.workspacePath()
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

  // rename document title --> update links with the old document title
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.renameDocumentTitle", renameTitle))

  // "go to definition" for links in Markdown documents
  vscode.languages.registerDefinitionProvider("markdown", new MarkdownDefinitionProvider())

  // save file --> run "tikibase check"
  const runTikibaseCheck = fileSaved.createCallback({ config, debug, workspacePath })
  vscode.workspace.onDidSaveTextDocument(runTikibaseCheck)

  if (config.tikibaseEnabled()) {
    // startup --> run "tikibase check"
    void runTikibaseCheck()

    // "tikibase fix" command
    context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.tikibaseFix", async function() {
      await tikibase.fix(workspacePath, debug)
    }))

    // "tikibase fix" code action
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        "markdown",
        new TikibaseProvider(),
        { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
      )
    )
    context.subscriptions.push(
      vscode.commands.registerCommand(
        TikibaseProvider.command,
        () => tikibase.fix(workspacePath, debug)
      )
    )
  }
}
