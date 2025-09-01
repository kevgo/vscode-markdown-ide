import * as path from "path"
import * as vscode from "vscode"
import * as configuration from "../configuration"
import { debug } from "../extension"
import * as helpers from "../helpers"
import * as files from "../helpers/files"
import * as line from "../helpers/line"
import * as links from "../helpers/links"
import { renameTitle } from "../rename-title/rename-title"

export class MarkdownRenameSymbolProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [vscode.CodeActionKind.Refactor]

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    if (!this.isFirstHeading(document, range)) {
      return []
    }

    const action = new vscode.CodeAction("Rename heading", vscode.CodeActionKind.Refactor)
    action.command = {
      command: "markdownIDE.renameSymbol",
      title: "Rename heading"
    }

    return [action]
  }

  private isFirstHeading(document: vscode.TextDocument, range: vscode.Range): boolean {
    const line = document.lineAt(range.start.line)

    // Check if we're on the first line and it's a heading
    if (range.start.line !== 0) {
      return false
    }

    // Check if the line starts with # (heading marker)
    const text = line.text.trim()
    return text.startsWith("#") && text.includes(" ")
  }
}

export class MarkdownRenameProvider implements vscode.RenameProvider {
  prepareRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Range | { range: vscode.Range; placeholder: string }> {
    let myOutputChannel: vscode.OutputChannel

    // Only allow renaming if we're on the first line and it's a heading
    if (position.line !== 0) {
      throw new Error("Rename is only supported for the document title on the first line")
    }

    const titleLine = document.lineAt(0)
    const text = titleLine.text.trim()

    if (!text.startsWith("#") || !text.includes(" ")) {
      throw new Error("Rename is only supported for headings that start with # and contain text")
    }

    // Extract the title text (without the # and spaces)
    const titleText = line.removeLeadingPounds(text)

    // Find the range of just the title text (not including the # symbols and spaces)
    const hashMatch = text.match(/^#+\s*/)
    const startOffset = hashMatch ? hashMatch[0].length : 0
    const startPos = new vscode.Position(0, startOffset)
    const endPos = new vscode.Position(0, startOffset + titleText.length)
    const titleRange = new vscode.Range(startPos, endPos)

    debug.appendLine(`prepare rename of ${titleText}`)

    return {
      range: titleRange,
      placeholder: titleText
    }
  }

  async provideRenameEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
    token: vscode.CancellationToken
  ): Promise<vscode.WorkspaceEdit | null> {
    debug.appendLine("determine rename edits")
    const wsRoot = configuration.workspacePath()
    if (!wsRoot) {
      return null
    }

    // Get the current title
    const titleLine = document.lineAt(0)
    const oldTitle = line.removeLeadingPounds(titleLine.text)

    debug.appendLine(`rename ${oldTitle} to ${newName}`)
    if (oldTitle === newName) {
      // No change needed
      return null
    }

    const edit = new vscode.WorkspaceEdit()

    debug.appendLine("Update the title in the current document")
    const newText = this.changeTitle({
      eol: helpers.eol2string(document.eol),
      newTitle: newName,
      oldTitle,
      text: document.getText()
    })
    const range = new vscode.Range(0, 0, document.lineCount, 0)
    edit.replace(document.uri, range, newText)

    debug.appendLine("Update the title of all affected links in all documents")
    const mdFiles: files.FileResult[] = []
    await files.markdown(wsRoot, mdFiles)
    const activeFilePath = document.fileName

    for (const file of mdFiles) {
      const pathToActive = path.relative(path.dirname(file.filePath), activeFilePath)
      const oldContent = await file.content
      const newContent = links.replaceTitle({ text: oldContent, oldTitle, target: pathToActive, newTitle: newName })
      if (newContent === oldContent) {
        continue
      }
      debug.appendLine(`replace link in file ${path}`)
      const range = new vscode.Range(0, 0, line.count(oldContent), 0)
      edit.replace(vscode.Uri.file(path.join(wsRoot, file.filePath)), range, newContent)
    }

    return edit
  }
}

export async function renameSymbol(): Promise<void> {
  renameTitle()
}
