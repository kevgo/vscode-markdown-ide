import * as path from "path"
import * as vscode from "vscode"

import * as configuration from "./configuration"
import * as files from "./helpers/files"
import * as line from "./helpers/line"
import * as links from "./helpers/links"

export async function filesDeleted(deletedEvent: vscode.FileDeleteEvent): Promise<void> {
  // flush all open changes to the filesystem since we are reading files below
  await vscode.workspace.saveAll(false)

  const wsRoot = configuration.workspacePath()
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
      for (const deletedFile of deletedEvent.files) {
        newContent = links.removeWithTarget({
          text: newContent,
          target: path.relative(path.dirname(fullPath), deletedFile.fsPath)
        })
      }
      if (newContent === oldContent) {
        continue
      }
      const range = new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(line.count(oldContent), 0)
      )
      edit.replace(vscode.Uri.file(fullPath), range, newContent)
    }
    await vscode.workspace.applyEdit(edit, { isRefactoring: true })
  })
}
