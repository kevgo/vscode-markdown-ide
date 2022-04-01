import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

export class MarkdownDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Definition | vscode.DefinitionLink[]> {
    const oldFilePath = document.fileName
    const linkTarget = extractLinkTarget(document.lineAt(position.line).text, position.character)
    if (!linkTarget) {
      throw new Error()
    }
    if (isWebLink(linkTarget)) {
      return new vscode.Location(vscode.Uri.parse(linkTarget), new vscode.Range(0, 0, 0, 0))
    }
    const oldFileName = path.basename(oldFilePath)
    const newFilePath = path.resolve(path.dirname(oldFilePath), linkTarget)
    const newFileContent = await fs.readFile(newFilePath, "utf-8")
    const newCursor = locateLinkWithTarget({ target: oldFileName, text: newFileContent })
    if (!newCursor) {
      throw new Error()
    }
    return new vscode.Location(vscode.Uri.file(newFilePath), new vscode.Position(newCursor.line, newCursor.character))
  }
}

export async function followBiDiLink(): Promise<void> {
  const oldEditor = vscode.window.activeTextEditor
  if (!oldEditor) {
    return
  }
  const oldDocument = oldEditor.document
  if (!oldDocument) {
    return
  }
  const oldFilePath = oldDocument.fileName
  const oldCursor = oldEditor.selection.start
  if (!oldCursor) {
    return
  }
  const linkTarget = extractLinkTarget(oldDocument.lineAt(oldCursor.line).text, oldCursor.character)
  if (!linkTarget) {
    return
  }
  if (isWebLink(linkTarget)) {
    await openWebLink(linkTarget)
    return
  }
  const oldFileName = path.basename(oldFilePath)
  const newFilePath = path.resolve(path.dirname(oldFilePath), linkTarget)
  const newDocument = await openFileLink(newFilePath)
  const newFileContent = newDocument.getText()
  if (!newFileContent) {
    return
  }
  const newCursor = locateLinkWithTarget({ target: oldFileName, text: newFileContent })
  if (!newCursor) {
    return
  }
  const newEditor = vscode.window.activeTextEditor
  if (!newEditor) {
    return
  }
  newEditor.selection = new vscode.Selection(newCursor, newCursor)
  newEditor.revealRange(newEditor.selection)
}

/** provides the position where the first link with the given target occurs in the given text */
export function locateLinkWithTarget(
  args: { target: string; text: string }
): vscode.Position | undefined {
  const re = new RegExp(`\\[[^\\]]*\\]\\(${args.target}\\)`)
  for (const [i, line] of args.text.split(/\r?\n/).entries()) {
    const match = re.exec(line)
    if (match) {
      return new vscode.Position(i, match.index)
    }
  }
}

/** opens the given link in the default web browser */
async function openWebLink(link: string) {
  await vscode.env.openExternal(vscode.Uri.parse(link))
}

/** opens a new tab with the given document */
async function openFileLink(link: string): Promise<vscode.TextDocument> {
  const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(link))
  await vscode.window.showTextDocument(doc)
  return doc
}

/** provides the target of the Markdown link around the given cursor position in the given text */
export function extractLinkTarget(lineText: string, cursorColumn: number): string | undefined {
  // go left until we find `[`
  let start = cursorColumn
  while (start >= 0 && lineText[start] !== "[") {
    start--
  }
  // if we didn't find it, go right until we find `[`
  if (start === -1) {
    start = cursorColumn
    while (start <= lineText.length && lineText[start] !== "[") {
      start++
    }
  }
  if (start === lineText.length + 1) {
    void vscode.window.showErrorMessage("No link found")
    return
  }
  // go right until we find `(`
  while (start <= lineText.length && lineText[start] !== "(") {
    start++
  }
  if (start === lineText.length + 1) {
    void vscode.window.showErrorMessage("No link found")
    return
  }
  // go right until we find `)`
  let end = start
  while (end <= lineText.length && lineText[end] !== ")") {
    end++
  }
  if (end === lineText.length + 1) {
    void vscode.window.showErrorMessage("No link found")
    return
  }
  return lineText.substring(start + 1, end)
}

/** indicates whether the given */
export function isWebLink(text: string): boolean {
  return text.startsWith("https://") || text.startsWith("http://")
}
