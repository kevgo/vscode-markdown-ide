import * as path from "path"
import * as vscode from "vscode"
import * as files from "./files"
import * as markdownLinks from "./markdown/links"
import * as markdownTitle from "./markdown/title"
import * as eol from "./text/eol"
import * as textLines from "./text/lines"
import * as workspace from "./workspace"

export class MarkdownRenameProvider implements vscode.RenameProvider {
  prepareRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Range | { range: vscode.Range; placeholder: string }> {
    // Only allow renaming if we're on the first line and it's a heading
    if (position.line !== 0) {
      throw new Error("Rename is only supported for the document title on the first line.")
    }

    const titleLine = document.lineAt(0)
    const text = titleLine.text.trim()

    if (!text.startsWith("#") || !text.includes(" ")) {
      throw new Error("Rename is only supported for headings that start with # and contain text")
    }

    // Extract the title text (without the # and spaces)
    const titleText = textLines.removeLeadingPounds(text)

    // Find the range of just the title text (not including the # symbols and spaces)
    const hashMatch = text.match(/^#+\s*/)
    const startOffset = hashMatch ? hashMatch[0].length : 0
    const startPos = new vscode.Position(0, startOffset)
    const endPos = new vscode.Position(0, startOffset + titleText.length)
    const titleRange = new vscode.Range(startPos, endPos)

    return {
      range: titleRange,
      placeholder: titleText
    }
  }

  async provideRenameEdits(
    document: vscode.TextDocument,
    _position: vscode.Position,
    newName: string,
    token: vscode.CancellationToken
  ): Promise<vscode.WorkspaceEdit | null> {
    const wsRoot = workspace.path()
    if (!wsRoot) {
      return null
    }

    // Get the current title
    const titleLine = document.lineAt(0)
    const oldTitle = textLines.removeLeadingPounds(titleLine.text)

    if (oldTitle === newName) {
      // No change needed
      return null
    }

    // Update the title in the current document
    const newText = markdownTitle.change({
      eol: eol.toString(document.eol),
      newTitle: newName,
      oldTitle,
      text: document.getText()
    })

    const edit = new vscode.WorkspaceEdit()
    const activeEditor = vscode.window.activeTextEditor
    if (activeEditor && activeEditor.document === document) {
      await activeEditor.edit((editBuilder) => {
        const range = new vscode.Range(0, 0, document.lineCount, 0)
        edit.replace(document.uri, range, newText)
      })
    }

    // Update the title of all affected links in all documents
    const mdFiles = await files.markdown(wsRoot)
    for (const file of mdFiles) {
      const filePath = path.join(wsRoot, file.filePath)
      const pathToActive = path.relative(path.dirname(filePath), document.fileName)
      const oldContent = await file.content
      const newContent = markdownLinks.replaceTitle({
        text: oldContent,
        oldTitle,
        target: pathToActive,
        newTitle: newName
      })
      if (newContent === oldContent) {
        continue
      }
      const range = new vscode.Range(0, 0, textLines.count(oldContent), 0)
      edit.replace(vscode.Uri.file(filePath), range, newContent)
    }
    await vscode.workspace.applyEdit(edit, { isRefactoring: true })
    return null
  }
}
