import * as vscode from "vscode"
import { extractNoteBody, extractNoteTitle, linkToNote, TikibaseProvider } from "./code-action-provider"
import { createCompletionProvider } from "./completion-item-provider"
import * as configuration from "./configuration"
import { MarkdownDefinitionProvider } from "./definition-provider"
import { filesDeleted } from "./files-deleted"
import { filesRenamed } from "./files-renamed"
import * as fileSaved from "./files-saved"
import { MarkdownReferenceProvider } from "./reference-provider"
import { MarkdownRenameProvider } from "./rename-title/rename-provider"
import * as tikibase from "./tikibase"

export let debug: vscode.OutputChannel

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const workspacePath = configuration.workspacePath()
  if (!workspacePath) {
    return
  }
  debug = vscode.window.createOutputChannel("Markdown IDE")
  debug.appendLine("Markdown IDE activated")
  const tikiConfig = await configuration.tikibase(workspacePath)

  // autocomplete links by typing `[`
  const completionProvider = createCompletionProvider(debug, workspacePath, tikiConfig)
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider("markdown", completionProvider, "["))

  // autocomplete headings by typing `#`
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider("markdown", completionProvider, "#"))

  // file renamed --> update links to this file
  vscode.workspace.onDidRenameFiles(filesRenamed)

  // file deleted --> remove links to this file
  vscode.workspace.onDidDeleteFiles(filesDeleted)

  // "rename symbol" refactor for Markdown titles
  context.subscriptions.push(
    vscode.languages.registerRenameProvider("markdown", new MarkdownRenameProvider())
  )

  // "Find All References" for Markdown files
  context.subscriptions.push(
    vscode.languages.registerReferenceProvider("markdown", new MarkdownReferenceProvider())
  )

  // "go to definition", "find all references"
  vscode.languages.registerDefinitionProvider("markdown", new MarkdownDefinitionProvider(tikiConfig))

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

  if (tikiConfig) {
    vscode.window.setStatusBarMessage("Markdown IDE: Tikibase mode", 10000)

    // save file --> run "tikibase check"
    const runTikibaseCheck = fileSaved.createCallback({ debug, workspacePath })
    vscode.workspace.onDidSaveTextDocument(runTikibaseCheck)

    // "tikibase fix" command
    context.subscriptions.push(vscode.commands.registerCommand("markdownIDE.tikibaseFix", async function() {
      await tikibase.fix(workspacePath, debug)
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
          await tikibase.fix(workspacePath, debug)
          await runTikibaseCheck()
        }
      )
    )

    // run "tikibase check" at startup
    void runTikibaseCheck()
  }
}
