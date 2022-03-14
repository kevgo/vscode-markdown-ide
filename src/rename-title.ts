import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { lineCount } from "./helpers/line-count"
import * as links from "./helpers/links"
import { removeLeadingPounds } from "./helpers/remove-leading-pounds"

export async function renameTitle(): Promise<void> {
  // make sure the filesystem contains the up-to-date contents
  await vscode.workspace.saveAll(false)

  const editor = vscode.window.activeTextEditor
  if (editor === undefined) {
    // no open editor
    return
  }
  const activeFilePath = editor.document.fileName
  if (activeFilePath === undefined) {
    // active file has no name
    return
  }

  // determine the existing and new title for the current document
  const titleLine = editor.document.lineAt(0)
  if (!titleLine) {
    // active document doesn't have content
    return
  }
  const oldTitle = removeLeadingPounds(titleLine.text)
  const newTitle = await enterTitle(oldTitle)
  if (newTitle === undefined) {
    // user aborted the dialog
    return
  }
  if (oldTitle === newTitle) {
    // title not changed
    return
  }

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Window, title: "updating link titles", cancellable: false },
    async () => {
      // replace the old title in all documents in the current workspace
      const edit = new vscode.WorkspaceEdit()
      const files = await vscode.workspace.findFiles("**/*.md")
      const fileCount = files.length
      for (let i = 0; i < fileCount; i++) {
        const file = files[i]
        const pathToActive = path.relative(path.dirname(file.fsPath), activeFilePath)
        const oldContent = await fs.readFile(file.fsPath, "utf8")
        const newContent = links.replaceTitle({ text: oldContent, oldTitle, target: pathToActive, newTitle })
        if (newContent === oldContent) {
          continue
        }
        const range = new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(lineCount(oldContent), 0)
        )
        edit.replace(file, range, newContent)
      }
      await vscode.workspace.applyEdit(edit)
    }
  )
}

/** lets the user enter the new document title via a text input dialog */
async function enterTitle(oldTitle: string): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: "new document title",
    value: oldTitle,
    valueSelection: [oldTitle.length, oldTitle.length]
  })
}