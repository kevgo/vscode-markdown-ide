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
      const url = extractUrl(document.lineAt(position.line).text, position.character)
      if (url) {
        await vscode.env.openExternal(vscode.Uri.parse(url))
        throw new Error()
      }
      throw new Error()
    }
    if (isWebLink(linkTarget)) {
      await vscode.env.openExternal(vscode.Uri.parse(linkTarget))
      throw new Error()
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

/** provides the URL at the given cursor position in the given text */
export function extractUrl(lineText: string, cursorColumn: number): string | undefined {
  let start = cursorColumn
  while (start >= 0 && lineText.substring(start, start + 4) !== "http") {
    start--
  }
  if (start === -1) {
    start = cursorColumn
    while (start < lineText.length && lineText.substring(start, start + 4) !== "http") {
      start++
    }
    if (start === lineText.length) {
      return
    }
  }
  let end = start
  /** characters that mark the end of a URL */
  const urlEnd = [" ", "\n"]
  while (end < lineText.length && !urlEnd.includes(lineText[end])) {
    end++
  }
  return lineText.substring(start, end)
}

/** indicates whether the given */
export function isWebLink(text: string): boolean {
  return text.startsWith("https://") || text.startsWith("http://")
}
