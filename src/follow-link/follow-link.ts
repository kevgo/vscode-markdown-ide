import * as vscode from "vscode"

export async function followLink(wsRoot: string, debug: vscode.OutputChannel): Promise<void> {
  // get current document
  const document = vscode.window.activeTextEditor?.document
  if (!document) {
    debug.appendLine("no active document found")
    return
  }

  // get current filename
  const filename = document.fileName

  // get current cursor position
  const cursor = vscode.window.activeTextEditor?.selection.start
  if (!cursor) {
    debug.appendLine("no active cursor found")
    return
  }

  // get text at current line
  const line = document.lineAt(cursor.line)

  // get link text
  const linkTarget = extractLinkTarget(line.text, cursor.character)

  // open linked page
  // find the first link to the referring filename
  // select that link
  await vscode.window.showInformationMessage("HELLO")
}

/** finds the Markdown link around the given cursor position in the given text */
export function extractLinkTarget(lineText: string, cursorColumn: number): string {
  // go left until we find `(`
  let start = cursorColumn
  while (start >= 0 && lineText[start] !== "(") {
    start--
  }
  // if we didn't find it, go right until we find `(`
  if (start === -1) {
    start = cursorColumn
    while (start <= lineText.length && lineText[start] !== "(") {
      start++
    }
  }
  // go right until we find `)`
  let end = cursorColumn
  while (end <= lineText.length && lineText[end] !== ")") {
    end++
  }
  // if we didn't find it, search left
  if (end === lineText.length + 1) {
    end = cursorColumn
    while (end >= start && lineText[end] !== ")") {
      end--
    }
  }
  return lineText.substring(start + 1, end)
}
