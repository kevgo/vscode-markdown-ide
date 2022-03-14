import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { lineCount } from "./helpers/line-count"
import * as links from "./helpers/links"

export async function filesDeleted(
  e: vscode.FileDeleteEvent
): Promise<void> {
  // make sure the filesystem contains the up-to-date contents
  await vscode.workspace.saveAll(false)

  // update all links in all files
  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Window, title: "removing links", cancellable: false },
    async () => {
      const edit = new vscode.WorkspaceEdit()
      for (const file of await vscode.workspace.findFiles("**/*.md")) {
        const oldContent = await fs.readFile(file.fsPath, "utf8")
        let newContent = oldContent
        for (const deletedFile of e.files) {
          const pathToDeleted = path.relative(path.dirname(file.fsPath), deletedFile.fsPath)
          newContent = links.removeToTarget({ text: newContent, target: pathToDeleted })
        }
        if (newContent === oldContent) {
          // didn't delete any links in this file --> move on to the next file
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
