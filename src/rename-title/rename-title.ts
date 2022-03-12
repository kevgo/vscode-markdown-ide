import { promises as fs } from "fs"
import * as vscode from "vscode"

import { removeLeadingPounds } from "../helpers/remove-leading-pounds"

export async function renameTitle(): Promise<void> {
  const titleLine = vscode.window.activeTextEditor?.document.lineAt(0)
  if (!titleLine) {
    // document doesn't have content
    return
  }
  const oldTitle = removeLeadingPounds(titleLine.text)
  const newTitle = await vscode.window.showInputBox({
    value: oldTitle,
    title: "new document title",
    valueSelection: [oldTitle.length, oldTitle.length]
  })
  if (newTitle === undefined) {
    // user aborted with ESC
    return
  }
  if (oldTitle === newTitle) {
    // no change to the title
    return
  }
  // const edit = new vscode.WorkspaceEdit()
  // for (const file of await vscode.workspace.findFiles("**/*.md")) {
  //   const oldContent = await fs.readFile(file.path, "utf8")
  //   const newContent = replacers.process(oldContent)
  //   if (newContent === oldContent) {
  //     continue
  //   }
  //   const range = new vscode.Range(
  //     new vscode.Position(0, 0),
  //     new vscode.Position(lineCount(oldContent), 0)
  //   )
  //   edit.replace(file, range, newContent)
  // }
  // await vscode.workspace.applyEdit(edit)
}
