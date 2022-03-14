import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { lineCount } from "./helpers/line-count"
import * as links from "./helpers/links"

export async function filesRenamed(
  e: vscode.FileRenameEvent
): Promise<void> {
  // make sure the filesystem contains the up-to-date contents
  await vscode.workspace.saveAll(false)

  // update all links in all files
  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Window, title: "updating link targets", cancellable: false },
    async () => {
      const edit = new vscode.WorkspaceEdit()
      for (const wsFile of await vscode.workspace.findFiles("**/*.md")) {
        const oldContent = await fs.readFile(wsFile.fsPath, "utf8")
        let newContent = oldContent
        for (const renamedFile of e.files) {
          const oldTarget = path.relative(path.dirname(wsFile.fsPath), renamedFile.oldUri.fsPath)
          const newTarget = path.relative(path.dirname(wsFile.fsPath), renamedFile.newUri.fsPath)
          newContent = links.replaceTarget({ text: newContent, oldTarget, newTarget })
        }
        if (newContent === oldContent) {
          continue
        }
        const range = new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(lineCount(oldContent), 0)
        )
        edit.replace(wsFile, range, newContent)
      }
      await vscode.workspace.applyEdit(edit)
    }
  )
}