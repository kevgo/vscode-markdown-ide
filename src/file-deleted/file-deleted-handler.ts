import * as vscode from "vscode"
import { promises as fs } from "fs"
import { lineCount } from "../helpers/line-count"
import { LinkRemovers } from "./link-removers"

export async function fileDeletedHandler(e: vscode.FileDeleteEvent) {
  // make sure the filesystem contains the up-to-date contents
  vscode.workspace.saveAll(false)

  // prepare
  const removers = new LinkRemovers()
  for (const file of e.files) {
    removers.register(vscode.workspace.asRelativePath(file.path))
  }

  // update all links in all files
  const edit = new vscode.WorkspaceEdit()
  for (const file of await vscode.workspace.findFiles("**/*.md")) {
    const oldContent = await fs.readFile(file.path, "utf8")
    const newContent = removers.process(oldContent)
    if (newContent === oldContent) {
      continue
    }
    const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(lineCount(oldContent), 0))
    edit.replace(file, range, newContent)
  }
  vscode.workspace.applyEdit(edit)
}
