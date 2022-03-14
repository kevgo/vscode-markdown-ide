import { promises as fs } from "fs"
import * as vscode from "vscode"

import { lineCount } from "../helpers/line-count"
import { LinkTargetReplacer } from "./link-target-replacer"

export async function fileRenamedHandler(
  e: vscode.FileRenameEvent
): Promise<void> {
  // make sure the filesystem contains the up-to-date contents
  await vscode.workspace.saveAll(false)

  // prepare
  const replacer = new LinkTargetReplacer()
  for (const file of e.files) {
    const before = vscode.workspace.asRelativePath(file.oldUri)
    const after = vscode.workspace.asRelativePath(file.newUri)
    replacer.register(before, after)
  }

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Window, title: "updating link targets", cancellable: false },
    async () => {
      // update all links in all files
      const edit = new vscode.WorkspaceEdit()
      for (const file of await vscode.workspace.findFiles("**/*.md")) {
        const oldContent = await fs.readFile(file.fsPath, "utf8")
        const newContent = replacer.process(oldContent)
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
