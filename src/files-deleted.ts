import * as path from "path"
import * as vscode from "vscode"

import * as files from "./helpers/files"
import * as workspace from "./helpers/workspace"
import * as line from "./text/line"
import * as links from "./text/links"

export async function filesDeleted(deletedEvent: vscode.FileDeleteEvent): Promise<void> {
  // flush all open changes to the filesystem since we are reading files below
  await vscode.workspace.saveAll(false)

  const wsRoot = workspace.path()
  if (!wsRoot) {
    return
  }
  const progressOpts: vscode.ProgressOptions = {
    location: vscode.ProgressLocation.Window,
    title: "removing links",
    cancellable: false
  }
  await vscode.window.withProgress(progressOpts, async () => {
    const edit = new vscode.WorkspaceEdit()
    const mdFiles = await files.markdown(wsRoot)
    for (const mdFile of mdFiles) {
      const oldContent = await mdFile.content
      let newContent = oldContent
      const fullPath = path.join(wsRoot, mdFile.filePath)
      const fullDir = path.dirname(fullPath)
      for (const deletedFile of deletedEvent.files) {
        newContent = links.removeWithTarget({
          text: newContent,
          target: path.relative(fullDir, deletedFile.fsPath)
        })
      }
      if (newContent !== oldContent) {
        const range = new vscode.Range(0, 0, line.count(oldContent), 0)
        edit.replace(vscode.Uri.file(fullPath), range, newContent)
      }
    }
    await vscode.workspace.applyEdit(edit, { isRefactoring: true })
  })
}
