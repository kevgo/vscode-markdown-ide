import * as path from "path"
import * as vscode from "vscode"
import * as files from "./files"

export async function extractNoteTitle(): Promise<void> {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return
  }
  const range = editor.selection
  const selectedText = editor.document.getText(range)
  const newFileName = files.mdFileName(selectedText)
  const newFileUri = vscode.Uri.file(path.join(path.dirname(editor.document.fileName), newFileName))
  const edit = new vscode.WorkspaceEdit()
  edit.replace(editor.document.uri, range, `[${selectedText}](${newFileName})`)
  edit.createFile(newFileUri, { overwrite: false })
  edit.insert(newFileUri, new vscode.Position(0, 0), `# ${selectedText}\n`)
  await vscode.workspace.applyEdit(edit)
}

export async function extractNoteBody(): Promise<void> {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return
  }
  const range = editor.selection
  const newTitle = await enterTitle()
  if (!newTitle) {
    return
  }
  const selectedText = editor.document.getText(range)
  const newFileName = files.mdFileName(newTitle)
  const newFileUri = vscode.Uri.file(path.join(path.dirname(editor.document.fileName), newFileName))
  const edit = new vscode.WorkspaceEdit()
  edit.replace(editor.document.uri, range, `[${newTitle}](${newFileName})`)
  edit.createFile(newFileUri, { overwrite: false })
  edit.insert(newFileUri, new vscode.Position(0, 0), `# ${newTitle}\n\n${selectedText}\n`)
  await vscode.workspace.applyEdit(edit)
}

export async function linkToNote(): Promise<void> {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return
  }
  const range = editor.selection
  const selectedText = editor.document.getText(range)
  const fileName = files.mdFileName(selectedText)
  const edit = new vscode.WorkspaceEdit()
  edit.replace(editor.document.uri, range, `[${selectedText}](${fileName})`)
  await vscode.workspace.applyEdit(edit)
}

async function enterTitle(): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: "new document title"
  })
}
