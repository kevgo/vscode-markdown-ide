import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"
import * as commands from "./commands"
import * as files from "./files"

export class MdCodeActionsProvider implements vscode.CodeActionProvider {
  async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): Promise<vscode.CodeAction[]> {
    const result: vscode.CodeAction[] = []

    // "extract note" refactors
    if (!range.isEmpty) {
      if (range.isSingleLine) {
        const text = document.getText(range)
        const fileName = files.mdFileName(text)
        const filePath = path.join(path.dirname(document.fileName), fileName)
        if (await files.isFile(filePath)) {
          result.push(linkToFileAction(fileName))
        } else {
          result.push(extractTitleAction(fileName))
        }
      } else {
        result.push(extractBodyAction())
      }
    }

    // provide autofixes for the fixable issues
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.code === "tikibase.fixable") {
        result.push(autoFixAction(diagnostic))
      }
    }

    return result
  }
}

function linkToFileAction(fileName: string): vscode.CodeAction {
  const result = new vscode.CodeAction(
    `link to ${fileName}`,
    vscode.CodeActionKind.RefactorRewrite
  )
  result.command = {
    command: commands.linkToNote,
    title: "replace the selection with a link to the selected file"
  }
  return result
}

function extractTitleAction(fileName: string): vscode.CodeAction {
  const result = new vscode.CodeAction(
    `create ${fileName}`,
    vscode.CodeActionKind.RefactorExtract
  )
  result.command = {
    command: commands.extractTitle,
    title: `create a new note with the filename "${fileName}"`
  }
  return result
}

function extractBodyAction(): vscode.CodeAction {
  const result = new vscode.CodeAction(
    "extract note with this content",
    vscode.CodeActionKind.RefactorExtract
  )
  result.command = {
    command: commands.extractBody,
    title: "create a new note with the selected text as content"
  }
  return result
}

function autoFixAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
  const result = new vscode.CodeAction("tikibase fix", vscode.CodeActionKind.QuickFix)
  result.command = {
    command: commands.autofix,
    title: "let Tikibase fix this and all other problems"
  }
  result.diagnostics = [diagnostic]
  result.isPreferred = true
  return result
}
