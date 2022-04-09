import { promises as fs } from "fs"
import * as path from "path"
import * as vscode from "vscode"

import { Tikibase } from "../configuration"

export class MarkdownDefinitionProvider implements vscode.DefinitionProvider {
  private tikiConfig: Tikibase | undefined

  constructor(config: Tikibase | undefined) {
    this.tikiConfig = config
  }

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
      }
      return []
    }
    if (isWebLink(linkTarget)) {
      await vscode.env.openExternal(vscode.Uri.parse(linkTarget))
      return []
    }
    const oldFileName = path.basename(oldFilePath)
    const newFilePath = path.resolve(path.dirname(oldFilePath), removeAnchor(linkTarget))
    const newFileContent = await fs.readFile(newFilePath, "utf-8")
    const newCursor = locateLinkWithTarget({ target: oldFileName, text: newFileContent })
    if (!newCursor) {
      return new vscode.Location(vscode.Uri.file(newFilePath), new vscode.Position(0, 0))
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
  // go left from the cursor until we find the beginning of the Markdown link
  let start = cursorColumn
  while (start >= 0 && lineText[start] !== "[") {
    start--
  }
  if (start === -1) {
    // didn't find the link beginning on the left of the cursor --> search to the right
    start = cursorColumn
    while (start <= lineText.length && lineText[start] !== "[") {
      start++
    }
  }
  if (start === lineText.length + 1) {
    void vscode.window.showErrorMessage("No link found")
    return
  }
  // keep going right until we find the start of the URL segment of the Markdown link
  while (start <= lineText.length && lineText[start] !== "(") {
    start++
  }
  if (start === lineText.length + 1) {
    void vscode.window.showErrorMessage("No link found")
    return
  }
  // keep going right until we find the end of the URL segment of the Markdown link
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
  // go left from the cursor until we find the beginning of the URL
  let start = cursorColumn
  while (start >= 0 && lineText.substring(start, start + 4) !== "http") {
    start--
  }
  if (start === -1) {
    // didn't find the URL beginning to the left --> search to the right
    start = cursorColumn
    while (start < lineText.length && lineText.substring(start, start + 4) !== "http") {
      start++
    }
    if (start === lineText.length) {
      return
    }
  }
  // find the end of the URL
  let end = start
  while (end < lineText.length && !urlEnds.includes(lineText[end])) {
    end++
  }
  return lineText.substring(start, end)
}
/** characters that mark the end of a URL */
const urlEnds = [" ", "\n"]

/** indicates whether the given */
export function isWebLink(text: string): boolean {
  return text.startsWith("https://") || text.startsWith("http://")
}

/** removes the link anchor from the given link */
export function removeAnchor(link: string): string {
  const pos = link.indexOf("#")
  if (pos === -1) {
    return link
  }
  return link.substring(0, pos)
}
