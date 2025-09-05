import * as vscode from "vscode"

export function toString(eol: vscode.EndOfLine): string {
  switch (eol) {
    case vscode.EndOfLine.LF:
      return "\n"
    case vscode.EndOfLine.CRLF:
      return "\r\n"
    default:
      throw new Error(`Unknown EndOfLine: ${eol}`)
  }
}
