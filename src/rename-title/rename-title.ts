import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import * as line from "../helpers/line"
import * as links from "../helpers/links"

export async function renameTitle(): Promise<void> {
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
      const doc = vscode.window.activeTextEditor?.document
      if (!doc) {
        return
      }
      const edit = new vscode.WorkspaceEdit() // change the title of the current document
      const newText = changeTitle({ eol: eol2string(doc.eol), newTitle, oldTitle, text: doc.getText() })
      const range = new vscode.Range(0, 0, doc.lineCount, 0)
      edit.replace(doc.uri, range, newText)

      // replace the old title in all documents in the current workspace
      for (const file of await vscode.workspace.findFiles("**/*.md")) {
        const pathToActive = path.relative(path.dirname(file.fsPath), activeFilePath)
        const oldContent = await fs.readFile(file.fsPath, "utf8")
        const newContent = links.replaceTitle({ text: oldContent, oldTitle, target: pathToActive, newTitle })
        if (newContent === oldContent) {
          continue
        }
        // TODO: change to other constructor
        const range = new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(line.count(oldContent), 0)
        )
        edit.replace(file, range, newContent)
      }
      await vscode.workspace.applyEdit(edit)
    }
  )
}

export function changeTitle(args: { eol: string; newTitle: string; oldTitle: string; text: string }): string {
  const lines = args.text.split(args.eol)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`# ${args.oldTitle}`)) {
      lines[i] = `# ${args.newTitle}`
      break
    }
  }
  return lines.join(args.eol)
}

/** lets the user enter the new document title via a text input dialog */
async function enterTitle(oldTitle: string): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: "new document title",
    value: oldTitle,
    valueSelection: [oldTitle.length, oldTitle.length]
  })
}

function eol2string(eol: vscode.EndOfLine): string {
  switch (eol) {
    case vscode.EndOfLine.LF:
      return "\n"
    case vscode.EndOfLine.CRLF:
      return "\r\n"
    default:
      throw new Error(`Unknown EndOfLine: ${eol}`)
  }
}
