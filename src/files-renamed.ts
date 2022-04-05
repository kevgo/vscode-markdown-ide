import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import * as configuration from "./configuration"
import * as files from "./helpers/files"
import * as line from "./helpers/line"
import * as links from "./helpers/links"

export async function filesRenamed(renamedEvent: vscode.FileRenameEvent): Promise<void> {
  // flush all open changes to the filesystem since we are reading files below
  await vscode.workspace.saveAll(false)

  const wsRoot = configuration.workspacePath()
  if (!wsRoot) {
    return
  }
  const progressOpts: vscode.ProgressOptions = {
    location: vscode.ProgressLocation.Window,
    title: "updating link targets",
    cancellable: false
  }
  await vscode.window.withProgress(progressOpts, async () => {
    const edit = new vscode.WorkspaceEdit()
    const mdFiles: files.FileResult[] = []
    await files.markdown(wsRoot, mdFiles)
    for (const wsFile of mdFiles) {
      const oldContent = await wsFile.content
      let newContent = oldContent
      const fullPath = path.join(wsRoot, wsFile.filePath)
      const fullDir = path.dirname(fullPath)
      for (const renamedFile of renamedEvent.files) {
        newContent = links.replaceTarget({
          text: newContent,
          oldTarget: path.relative(fullDir, renamedFile.oldUri.fsPath),
          newTarget: path.relative(fullDir, renamedFile.newUri.fsPath)
        })
      }
      if (newContent === oldContent) {
        continue
      }
      const range = new vscode.Range(0, 0, line.count(oldContent), 0)
      edit.replace(vscode.Uri.file(fullPath), range, newContent)
    }
    await vscode.workspace.applyEdit(edit)
  })
}
