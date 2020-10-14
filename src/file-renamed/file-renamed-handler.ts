import { promises as fs } from "fs"
import * as vscode from "vscode"

import { lineCount } from "../helpers/line-count"
import { LinkReplacers } from "./link-replacers"

export async function fileRenamedHandler(e: vscode.FileRenameEvent): void {
  // make sure the filesystem contains the up-to-date contents
  await vscode.workspace.saveAll(false)

  // prepare
  const replacers = new LinkReplacers()
  for (const file of e.files) {
    const before = vscode.workspace.asRelativePath(file.oldUri)
    const after = vscode.workspace.asRelativePath(file.newUri)
    replacers.register(before, after)
  }

  // update all links in all files
  const edit = new vscode.WorkspaceEdit()
  for (const file of await vscode.workspace.findFiles("**/*.md")) {
    const oldContent = await fs.readFile(file.path, "utf8")
    const newContent = replacers.process(oldContent)
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
