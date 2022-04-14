import * as slugify from "@sindresorhus/slugify"
import * as vscode from "vscode"

import * as files from "../helpers/files"

export class TikibaseProvider implements vscode.CodeActionProvider {
  /** name of the code action that this provider implements */
  public static readonly autofixCommandName = "vscode-markdown-ide.autofix"
  public static readonly extractNoteCommandName = "vscode-markdown-ide.extractNote"

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const result: vscode.CodeAction[] = []

    // "extract note" refactor
    if (!range.isEmpty) {
      const extractNoteAction = new vscode.CodeAction("extract note", vscode.CodeActionKind.RefactorExtract)
      // extractNoteAction.command = {
      //   command: TikibaseProvider.extractNoteCommandName,
      //   title: "extract this text into a new note"
      // }
      extractNoteAction.edit = extractNoteEdit(document, range)
      result.push(extractNoteAction)
    }

    // provide autofixes for the fixable issues
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.code !== "tikibase.fixable") {
        continue
      }
      const action = new vscode.CodeAction("tikibase fix", vscode.CodeActionKind.QuickFix)
      action.command = {
        command: TikibaseProvider.autofixCommandName,
        title: "let Tikibase fix this and all other problems"
      }
      action.diagnostics = [diagnostic]
      action.isPreferred = true
      result.push(action)
    }

    return result
  }
}

export function extractNoteEdit(
  document: vscode.TextDocument,
  range: vscode.Range | vscode.Selection
): vscode.WorkspaceEdit {
  if (range.isSingleLine) {
    return extractNoteTitleEdit(document, range)
  } else {
    return extractNoteBodyEdit(document, range)
  }
}

function extractNoteTitleEdit(
  document: vscode.TextDocument,
  range: vscode.Range | vscode.Selection
): vscode.WorkspaceEdit {
  const edit = new vscode.WorkspaceEdit()
  const selectedText = document.getText(range)
  const newFileName = mdFileName(selectedText)
  const linkToNewNote = `[${selectedText}](${newFileName})`
  edit.replace(document.uri, range, linkToNewNote)
  void vscode.window.showInformationMessage("EDITING")
  return edit
}

function extractNoteBodyEdit(
  document: vscode.TextDocument,
  range: vscode.Range | vscode.Selection
): vscode.WorkspaceEdit {
  const edit = new vscode.WorkspaceEdit()
  return edit
}

/** converts the given text into a proper filename */
export function mdFileName(text: string): string {
  return `${slugify(text)}.md`
}
