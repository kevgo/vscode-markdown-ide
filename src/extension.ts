import * as vscode from "vscode"

import { TikibaseProvider } from "./code-action/tikibase-provider"
import { Configuration } from "./configuration"
import * as fileSaved from "./file-saved/file-saved"
import { filesDeleted } from "./files-deleted"
import { filesRenamed } from "./files-renamed"
import { followBiDiLink, MarkdownDefinitionProvider } from "./follow-link/follow-bidi-link"
import { markdownHeadingProvider } from "./markdown-heading-completion/markdown-heading-provider"
import { markdownLinkCompletionProvider } from "./markdown-link-completion/markdown-link-provider"
import { renameTitle } from "./rename-title"
import * as tikibase from "./tikibase"

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

  // "tikibase fix" command
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.tikibaseFix", async function() {
    await tikibase.fix(workspacePath, debug)
  }))

  // "follow bidi link" command
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.followBiDiLink", followBiDiLink))

  // "go to definition" for links in Markdown documents
  vscode.languages.registerDefinitionProvider("markdown", new MarkdownDefinitionProvider())

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
