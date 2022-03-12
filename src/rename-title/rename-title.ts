import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { lineCount } from "../helpers/line-count"
import { removeLeadingPounds } from "../helpers/remove-leading-pounds"
import * as titleReplacer from "./title-replacer"

export async function renameTitle(): Promise<void> {
  // make sure the filesystem contains the up-to-date contents
  await vscode.workspace.saveAll(false)

  const renamedFilePath = vscode.window.activeTextEditor?.document.fileName
  if (renamedFilePath === undefined) { // no file open in editor
    return
  }

  // determine the existing and new title for the current document
  const titleLine = vscode.window.activeTextEditor?.document.lineAt(0)
  if (!titleLine) { // document doesn't have a first line
    return
  }
  const oldTitle = removeLeadingPounds(titleLine.text)
  const newTitle = await queryTitle(oldTitle)
  if (newTitle === undefined) { // user aborted the dialog
    return
  }
  if (oldTitle === newTitle) { // no change to the title
    return
  }

  // replace the old title in all documents in the current workspace
  const edit = new vscode.WorkspaceEdit()
  for (const file of await vscode.workspace.findFiles("**/*.md")) {
    const filePath = file.fsPath
    const relativeFile = path.relative(path.dirname(filePath), renamedFilePath)
    const replace = titleReplacer.create(oldTitle, relativeFile, newTitle)
    const oldContent = await fs.readFile(file.path, "utf8")
    const newContent = replace(oldContent)
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

/** queries the new document title from the user via a text input dialog */
async function queryTitle(oldTitle: string): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: "new document title",
    value: oldTitle,
    valueSelection: [oldTitle.length, oldTitle.length]
  })
}
