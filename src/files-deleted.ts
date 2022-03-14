import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import * as line from "./helpers/line"
import * as links from "./helpers/links"

export async function filesDeleted(deletedEvent: vscode.FileDeleteEvent): Promise<void> {
  // flush all open changes to the filesystem since we are reading files below
  await vscode.workspace.saveAll(false)

  const progressOpts: vscode.ProgressOptions = {
    location: vscode.ProgressLocation.Window,
    title: "removing links",
    cancellable: false
  }
  await vscode.window.withProgress(progressOpts, async () => {
    const edit = new vscode.WorkspaceEdit()
    for (const wsFile of await vscode.workspace.findFiles("**/*.md")) {
      const oldContent = await fs.readFile(wsFile.fsPath, "utf8")
      let newContent = oldContent
      for (const deletedFile of deletedEvent.files) {
        newContent = links.removeWithTarget({
          text: newContent,
          target: path.relative(path.dirname(wsFile.fsPath), deletedFile.fsPath)
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
