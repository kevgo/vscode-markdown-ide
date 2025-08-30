import * as vscode from "vscode"

import { createCompletionProvider } from "./autocomplete/provider"
import { extractNoteBody, extractNoteTitle, linkToNote, TikibaseProvider } from "./code-action/tikibase-provider"
import * as configuration from "./configuration"
import * as fileSaved from "./file-saved/file-saved"
import { filesDeleted } from "./files-deleted"
import { filesRenamed } from "./files-renamed"
import { MarkdownDefinitionProvider } from "./follow-link/follow-bidi-link"
import {
  MarkdownRenameProvider,
  MarkdownRenameSymbolProvider,
  renameSymbol
} from "./rename-symbol/rename-symbol-provider"
import { renameTitle } from "./rename-title/rename-title"
import * as tikibase from "./tikibase"

export let output: vscode.OutputChannel

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const workspacePath = configuration.workspacePath()
  if (!workspacePath) {
    return
  }
  output = vscode.window.createOutputChannel("Markdown IDE")
  output.appendLine("Markdown IDE activates")
  const tikiConfig = await configuration.tikibase(workspacePath)

  // autocomplete links by typing `[`
  const completionProvider = createCompletionProvider(output, workspacePath, tikiConfig)
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider("markdown", completionProvider, "["))

  // autocomplete headings by typing `#`
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider("markdown", completionProvider, "#"))

  // file renamed --> update links to this file
  vscode.workspace.onDidRenameFiles(filesRenamed)

  // file deleted --> remove links to this file
  vscode.workspace.onDidDeleteFiles(filesDeleted)

  // rename document title --> update links with the old document title
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.renameDocumentTitle", renameTitle))

  // rename symbol refactor provider
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      "markdown",
      new MarkdownRenameSymbolProvider(),
      { providedCodeActionKinds: MarkdownRenameSymbolProvider.providedCodeActionKinds }
    )
  )
  context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.renameSymbol", renameSymbol))

  // register rename provider for built-in VSCode rename symbol functionality
  context.subscriptions.push(
    vscode.languages.registerRenameProvider("markdown", new MarkdownRenameProvider())
  )

  // "go to definition" for links in Markdown documents
  vscode.languages.registerDefinitionProvider("markdown", new MarkdownDefinitionProvider(tikiConfig))

  if (tikiConfig) {
    vscode.window.setStatusBarMessage("Markdown IDE: Tikibase mode", 10000)

    // save file --> run "tikibase check"
    const runTikibaseCheck = fileSaved.createCallback({ debug: output, workspacePath })
    vscode.workspace.onDidSaveTextDocument(runTikibaseCheck)

    // "tikibase fix" command
    context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.tikibaseFix", async function() {
      await tikibase.fix(workspacePath, output)
    }))

    // "tikibase fix" code action
    context.subscriptions.push(
      vscode.languages.registerCodeActionsProvider(
        "markdown",
        new TikibaseProvider(),
        { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix, vscode.CodeActionKind.RefactorExtract] }
      )
    )
    context.subscriptions.push(
      vscode.commands.registerCommand(
        TikibaseProvider.autofixCommandName,
        async () => {
          await tikibase.fix(workspacePath, output)
          await runTikibaseCheck()
        }
      )
    )

    // "extract title" refactor
    context.subscriptions.push(
      vscode.commands.registerCommand(
        TikibaseProvider.extractTitleCommandName,
        extractNoteTitle
      )
    )

    // "extract body" refactor
    context.subscriptions.push(
      vscode.commands.registerCommand(
        TikibaseProvider.extractBodyCommandName,
        extractNoteBody
      )
    )

    // "link to note" refactor
    context.subscriptions.push(
      vscode.commands.registerCommand(
        TikibaseProvider.linkToNoteCommandName,
        linkToNote
      )
    )

    // run "tikibase check" at startup
    void runTikibaseCheck()
  }
}
