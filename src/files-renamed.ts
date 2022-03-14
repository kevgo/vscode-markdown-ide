import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import * as line from "./helpers/line"
import * as links from "./helpers/links"

export async function filesRenamed(
  e: vscode.FileRenameEvent
): Promise<void> {
  // make sure the filesystem contains the up-to-date changes
  // since we are looking at the filesystem contents
  await vscode.workspace.saveAll(false)

  const progressOpts: vscode.ProgressOptions = {
    location: vscode.ProgressLocation.Window,
    title: "updating link targets",
    cancellable: false
  }
  await vscode.window.withProgress(progressOpts, async () => {
    const edit = new vscode.WorkspaceEdit()
    for (const wsFile of await vscode.workspace.findFiles("**/*.md")) {
      const oldContent = await fs.readFile(wsFile.fsPath, "utf8")
      let newContent = oldContent
      for (const renamedFile of e.files) {
        newContent = links.replaceTarget({
          text: newContent,
          oldTarget: path.relative(path.dirname(wsFile.fsPath), renamedFile.oldUri.fsPath),
          newTarget: path.relative(path.dirname(wsFile.fsPath), renamedFile.newUri.fsPath)
        })
      }
      if (newContent === oldContent) {
        continue
      }
      const range = new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(line.count(oldContent), 0)
      )
      edit.replace(wsFile, range, newContent)
    }
    await vscode.workspace.applyEdit(edit)
  })
}
