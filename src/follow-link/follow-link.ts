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
  if (!linkTarget) {
    debug.appendLine("no link found")
    return
  }

  // open linked page
  if (isWebLink(linkTarget)) {
    //
  }

  // find the first link to the referring filename
  // select that link
  await vscode.window.showInformationMessage("HELLO")
}

/** provides the target of the Markdown link around the given cursor position in the given text */
export function extractLinkTarget(lineText: string, cursorColumn: number): string | undefined {
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
  if (start === lineText.length + 1) {
    // start token not found in entire string
    return undefined
  }
  // go right until we find `)`
  let end = start
  while (end <= lineText.length && lineText[end] !== ")") {
    end++
  }
  if (end === lineText.length + 1) {
    // end token not found in entire string
    return undefined
  }
  return lineText.substring(start + 1, end)
}

/** indicates whether the given */
export function isWebLink(text: string): boolean {
  return true
}
