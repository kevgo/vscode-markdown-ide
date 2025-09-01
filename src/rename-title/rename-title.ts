import * as path from "path"
import * as vscode from "vscode"

import * as configuration from "../configuration"
import { debug } from "../extension"
import * as helpers from "../helpers"
import * as files from "../helpers/files"
import * as line from "../helpers/line"
import * as links from "../helpers/links"

export async function renameTitle(): Promise<void> {
  const wsRoot = configuration.workspacePath()
  if (!wsRoot) {
    return
  }

  // flush all open changes to the filesystem since we are reading files below
  await vscode.workspace.saveAll(false)

  const editor = vscode.window.activeTextEditor
  if (!editor) {
    // no open editor
    return
  }
  const activeFilePath = editor.document.fileName
  if (!activeFilePath) {
    // active file has no name
    return
  }

  // determine the existing and new title for the current document
  const titleLine = editor.document.lineAt(0)
  if (!titleLine) {
    // active document doesn't have content
    return
  }
  const oldTitle = line.removeLeadingPounds(titleLine.text)
  const newTitle = await enterTitle(oldTitle)
  if (!newTitle) {
    // user aborted the dialog
    return
  }
  if (oldTitle === newTitle) {
    // title not changed
    return
  }

  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Window, title: "updating link titles", cancellable: false },
    async () => {
      const edit = new vscode.WorkspaceEdit() // change the title of the current document
      debug.appendLine(`replacing ${oldTitle} with ${newTitle}`)

      // update the title in the active document
      const doc = vscode.window.activeTextEditor?.document
      if (doc) {
        const newText = helpers.changeMdTitle({
          eol: helpers.eol2string(doc.eol),
          newTitle,
          oldTitle,
          text: doc.getText()
        })
        const range = new vscode.Range(0, 0, doc.lineCount, 0)
        edit.replace(doc.uri, range, newText)
      }

      // update the title of all affected links in all documents
      const workspacePath = configuration.workspacePath()
      if (!workspacePath) {
        return
      }
      const mdFiles: files.FileResult[] = []
      await files.markdown(wsRoot, mdFiles)
      for (const file of mdFiles) {
        const pathToActive = path.relative(path.dirname(file.filePath), activeFilePath)
        const oldContent = await file.content
        const newContent = links.replaceTitle({ text: oldContent, oldTitle, target: pathToActive, newTitle })
        if (newContent === oldContent) {
          continue
        }
        debug.appendLine(`updating links in ${file.filePath}`)
        const range = new vscode.Range(0, 0, line.count(oldContent), 0)
        edit.replace(vscode.Uri.file(path.join(wsRoot, file.filePath)), range, newContent)
      }
      await vscode.workspace.applyEdit(edit)
    }
  )
}

/** lets the user enter the new document title via a text input dialog */
async function enterTitle(oldTitle: string): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: "new document title",
    value: oldTitle,
    valueSelection: [oldTitle.length, oldTitle.length]
  })
}
