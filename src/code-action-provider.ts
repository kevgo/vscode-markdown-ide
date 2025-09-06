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

    // "extract note" refactor
    if (!range.isEmpty) {
      if (range.isSingleLine) {
        const text = document.getText(range)
        const fileName = files.mdFileName(text)
        const filePath = path.join(path.dirname(document.fileName), fileName)
        const isFile = await files.isFile(filePath)
        if (isFile) {
          // "link to note" refactor
          const linkToFileAction = new vscode.CodeAction(
            `link to ${fileName}`,
            vscode.CodeActionKind.RefactorRewrite
          )
          linkToFileAction.command = {
            command: commands.linkToNote,
            title: "replace the selection with a link to the selected file"
          }
          result.push(linkToFileAction)
        } else {
          // "extract title" refactor
          const extractTitleAction = new vscode.CodeAction(
            `create ${fileName}`,
            vscode.CodeActionKind.RefactorExtract
          )
          extractTitleAction.command = {
            command: commands.extractTitle,
            title: `create a new note with the filename "${fileName}"`
          }
          result.push(extractTitleAction)
        }
      } else {
        // "extract body" refactor
        const extractBodyAction = new vscode.CodeAction(
          "extract note with this content",
          vscode.CodeActionKind.RefactorExtract
        )
        extractBodyAction.command = {
          command: commands.extractBody,
          title: "create a new note with the selected text as content"
        }
        result.push(extractBodyAction)
      }
    }

    // provide autofixes for the fixable issues
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.code !== "tikibase.fixable") {
        continue
      }
      const action = new vscode.CodeAction("tikibase fix", vscode.CodeActionKind.QuickFix)
      action.command = {
        command: commands.autofix,
        title: "let Tikibase fix this and all other problems"
      }
      action.diagnostics = [diagnostic]
      action.isPreferred = true
      result.push(action)
    }

    return result
  }
}
